using NRedisStack;
using StackExchange.Redis;
using System.Text.Json;

namespace Valu.Api.Services;

public class RedisCacheService : ICacheService, IDisposable
{
    private readonly ConnectionMultiplexer _redis;
    private readonly IDatabase _database;

    public RedisCacheService(string connectionString = "localhost")
    {
        _redis = ConnectionMultiplexer.Connect(connectionString);
        _database = _redis.GetDatabase();
    }

    public async Task<T?> GetAsync<T>(string key) where T : class
    {
        try
        {
            var json = await _database.StringGetAsync(key);
            if (json.HasValue)
            {
                return JsonSerializer.Deserialize<T>(json!);
            }
            return null;
        }
        catch
        {
            return null;
        }
    }

    public async Task SetAsync<T>(string key, T data, TimeSpan duration) where T : class
    {
        if (data == null)
            throw new ArgumentNullException(nameof(data));

        try
        {
            var json = JsonSerializer.Serialize(data);
            await _database.StringSetAsync(key, json, duration);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to set cache key '{key}'", ex);
        }
    }

    public async Task<bool> ContainsAsync(string key)
    {
        try
        {
            return await _database.KeyExistsAsync(key);
        }
        catch
        {
            return false;
        }
    }

    public async Task RemoveAsync(string key)
    {
        try
        {
            await _database.KeyDeleteAsync(key);
        }
        catch
        {
            // Ignore errors when removing
        }
    }

    public async Task ClearAsync()
    {
        try
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            await server.FlushDatabaseAsync();
        }
        catch
        {
            // Ignore errors when clearing
        }
    }

    public async Task<IEnumerable<string>> GetAllKeysAsync(string pattern = "*")
    {
        try
        {
            var server = _redis.GetServer(_redis.GetEndPoints().First());
            var keys = server.Keys(pattern: pattern);
            return keys.Select(k => k.ToString()).ToList();
        }
        catch
        {
            return Enumerable.Empty<string>();
        }
    }

    public async Task<int> CountAsync(string pattern = "*")
    {
        try
        {
            var keys = await GetAllKeysAsync(pattern);
            return keys.Count();
        }
        catch
        {
            return 0;
        }
    }

    public void Dispose()
    {
        _redis?.Dispose();
    }
}