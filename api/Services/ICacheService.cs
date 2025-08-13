namespace Valu.Api.Services;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key) where T : class;
    Task SetAsync<T>(string key, T data, TimeSpan duration) where T : class;
    Task<bool> ContainsAsync(string key);
    Task RemoveAsync(string key);
    Task ClearAsync();
    Task<IEnumerable<string>> GetAllKeysAsync(string pattern = "*");
    Task<int> CountAsync(string pattern = "*");
}