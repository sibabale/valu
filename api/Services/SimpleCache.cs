namespace Valu.Api.Services;

public class SimpleCache
{
    private readonly Dictionary<string, (object data, DateTime expiry)> _cache = new();
    private readonly object _syncLock = new object();
    
    public T? Get<T>(string key) where T : class
    {
        lock (_syncLock)
        {
            if (_cache.TryGetValue(key, out var cached))
            {
                // Check if entry has expired and remove it if so
                if (DateTime.UtcNow >= cached.expiry)
                {
                    _cache.Remove(key);
                    return null;
                }
                
                // Check if the cached data is of the expected type before casting
                if (cached.data is T typedData)
                {
                    return typedData;
                }
                
                // If type doesn't match, remove the invalid entry and return null
                _cache.Remove(key);
                return null;
            }
            return null;
        }
    }
    
    public void Set<T>(string key, T data, TimeSpan duration) where T : class
    {
        if (data == null)
            throw new ArgumentNullException(nameof(data));
            
        lock (_syncLock)
        {
            _cache[key] = (data, DateTime.UtcNow.Add(duration));
        }
    }
    
    public bool Contains(string key)
    {
        lock (_syncLock)
        {
            if (_cache.TryGetValue(key, out var cached))
            {
                // Check if entry has expired and remove it if so
                if (DateTime.UtcNow >= cached.expiry)
                {
                    _cache.Remove(key);
                    return false;
                }
                return true;
            }
            return false;
        }
    }
    
    public void Remove(string key)
    {
        lock (_syncLock)
        {
            _cache.Remove(key);
        }
    }
    
    public void Clear()
    {
        lock (_syncLock)
        {
            _cache.Clear();
        }
    }
    
    public IEnumerable<string> GetAllKeys()
    {
        try
        {
            lock (_syncLock)
            {
                var expiredKeys = new List<string>();
                var validKeys = new List<string>();
                
                foreach (var kvp in _cache)
                {
                    if (DateTime.UtcNow >= kvp.Value.expiry)
                    {
                        expiredKeys.Add(kvp.Key);
                    }
                    else
                    {
                        validKeys.Add(kvp.Key);
                    }
                }
                
                // Remove expired entries
                foreach (var key in expiredKeys)
                {
                    _cache.Remove(key);
                }
                
                return validKeys.ToList(); // Return a copy to avoid threading issues
            }
        }
        catch (Exception)
        {
            // Return empty collection if there's any issue
            return Enumerable.Empty<string>();
        }
    }
    
    /// <summary>
    /// Manually clean up expired entries from the cache
    /// </summary>
    public void CleanupExpiredEntries()
    {
        lock (_syncLock)
        {
            var expiredKeys = _cache
                .Where(kvp => DateTime.UtcNow >= kvp.Value.expiry)
                .Select(kvp => kvp.Key)
                .ToList();
                
            foreach (var key in expiredKeys)
            {
                _cache.Remove(key);
            }
        }
    }
    
    /// <summary>
    /// Get the number of entries in the cache (including expired ones)
    /// </summary>
    public int Count
    {
        get
        {
            lock (_syncLock)
            {
                return _cache.Count;
            }
        }
    }
    
    /// <summary>
    /// Get the number of valid (non-expired) entries in the cache
    /// </summary>
    public int ValidCount
    {
        get
        {
            lock (_syncLock)
            {
                return _cache.Count(kvp => DateTime.UtcNow < kvp.Value.expiry);
            }
        }
    }
} 