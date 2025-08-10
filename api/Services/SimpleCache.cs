namespace Valu.Api.Services;

public class SimpleCache
{
    private readonly Dictionary<string, (object data, DateTime expiry)> _cache = new();
    
    public T? Get<T>(string key) where T : class
    {
        if (_cache.TryGetValue(key, out var cached) && DateTime.UtcNow < cached.expiry)
        {
            return (T)cached.data;
        }
        return null;
    }
    
    public void Set<T>(string key, T data, TimeSpan duration) where T : class
    {
        _cache[key] = (data, DateTime.UtcNow.Add(duration));
    }
    
    public bool Contains(string key)
    {
        return _cache.TryGetValue(key, out var cached) && DateTime.UtcNow < cached.expiry;
    }
    
    public void Remove(string key)
    {
        _cache.Remove(key);
    }
    
    public void Clear()
    {
        _cache.Clear();
    }
    
    public IEnumerable<string> GetAllKeys()
    {
        return _cache.Keys.Where(key => _cache.TryGetValue(key, out var cached) && DateTime.UtcNow < cached.expiry);
    }
} 