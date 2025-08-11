# Cache Expansion & Quota Optimization Plan

## Current State Analysis
- **Companies**: 5 (AAPL, MSFT, GOOGL, AMZN, TSLA)
- **Cache TTL**: 1 day
- **API Quota**: 500 calls/day (free tier)
- **Current Usage**: ~5 calls/day (very inefficient)

## Strategic Goal
Maximize user experience while optimizing API quota usage through intelligent caching strategy.

---

## Phase 1: Expand to 20 Companies (Immediate)

### Target Companies (20)
```csharp
var expandedCompanies = [
    // Current 5
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
    
    // Add 15 more (diverse sectors)
    "NVDA", "META", "BRK.A", "UNH", "JNJ",     // Tech, Healthcare
    "JPM", "V", "PG", "HD", "MA",              // Finance, Consumer
    "DIS", "PYPL", "NFLX", "CRM", "ADBE",      // Media, Software
    "ORCL", "INTC", "CSCO", "PEP", "ABT"       // Tech, Consumer, Healthcare
];
```

### Implementation Steps
1. **Update CacheBuildingService**
   - [ ] Expand `_initialCompanies` array to 20
   - [ ] Test with current 1-day TTL

2. **Timing Strategy**
   - **5 companies**: ~1 minute (current)
   - **20 companies**: ~4 minutes (respecting 5 calls/minute)
   - **Total API calls**: 20 calls (4% of daily quota)

3. **User Experience Impact**
   - **Before**: 5 companies on home page
   - **After**: 20 companies on home page
   - **Improvement**: 4x more content

---

## Phase 2: Quota Optimization (Max Out Daily)

### Current Quota Usage
- **Daily Limit**: 500 calls
- **Current Usage**: 20 calls (4%)
- **Wasted Quota**: 480 calls (96%)

### Optimization Strategy
```csharp
// Target: Use 400-450 calls per day (80-90% of quota)
// Reserve 50-100 calls for user searches and emergencies

var dailyQuotaTarget = 450; // 90% of 500
var companiesPerDay = 450;   // 1 call per company
var cacheTTL = 7;           // 7 days (weekly refresh)
```

### Implementation Plan
1. **Expand to 450 Companies**
   - [ ] Research top 450 companies by market cap
   - [ ] Categorize by sector (diversification)
   - [ ] Prioritize by user interest

2. **Batch Processing Strategy**
   ```csharp
   // Day 1: Companies 1-450 (450 calls)
   // Day 2-7: No API calls (cache serves users)
   // Day 8: Refresh cache (450 calls)
   // Cycle repeats weekly
   ```

3. **Cache TTL Extension**
   - [ ] Change from 1 day to 7 days
   - [ ] Weekly refresh cycle
   - [ ] Survive quota exhaustion

---

## Phase 3: Sustainable Weekly Model

### Weekly Schedule
```
Monday:    Build/Refresh Cache (450 API calls)
Tuesday:   Serve from cache (0 API calls)
Wednesday: Serve from cache (0 API calls)
Thursday:  Serve from cache (0 API calls)
Friday:    Serve from cache (0 API calls)
Saturday:  Serve from cache (0 API calls)
Sunday:    Serve from cache (0 API calls)
```

### Benefits
- **User Experience**: 450 companies available daily
- **API Efficiency**: 90% quota utilization
- **Cost Effective**: No paid API upgrades needed
- **Reliable**: Cache survives quota exhaustion

---

## Implementation Details

### 1. Update CacheBuildingService
```csharp
public class CacheBuildingService
{
    // Phase 1: 20 companies
    private readonly string[] _phase1Companies = [
        "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
        "NVDA", "META", "BRK.A", "UNH", "JNJ",
        "JPM", "V", "PG", "HD", "MA",
        "DIS", "PYPL", "NFLX", "CRM", "ADBE"
    ];
    
    // Phase 2: 450 companies (future)
    private readonly string[] _phase2Companies = [
        // Top 450 companies by market cap
        // Categorized by sector
        // Prioritized by user interest
    ];
    
    public async Task BuildPhase1CacheAsync()
    {
        // Build 20 companies (current implementation)
    }
    
    public async Task BuildPhase2CacheAsync()
    {
        // Build 450 companies (future implementation)
        // Respect 5 calls/minute limit
        // Handle quota exhaustion gracefully
    }
}
```

### 2. Cache TTL Configuration
```csharp
// Current: 1 day
_cache.Set(cacheKey, company, TimeSpan.FromDays(1));

// Phase 1: 7 days
_cache.Set(cacheKey, company, TimeSpan.FromDays(7));

// Future: Configurable
var cacheTTL = _configuration.GetValue<int>("CacheTTLDays", 7);
_cache.Set(cacheKey, company, TimeSpan.FromDays(cacheTTL));
```

### 3. Quota Monitoring
```csharp
public class QuotaMonitor
{
    private int _dailyCallCount = 0;
    private DateTime _lastReset = DateTime.Today;
    
    public bool CanMakeCall()
    {
        ResetDailyCount();
        return _dailyCallCount < 450; // 90% of 500
    }
    
    public void RecordCall()
    {
        _dailyCallCount++;
    }
}
```

---

## Success Metrics

### User Experience
- [ ] Home page shows 20+ companies (Phase 1)
- [ ] Home page shows 450+ companies (Phase 2)
- [ ] Response time < 100ms (cached data)
- [ ] Cache hit rate > 95%

### API Efficiency
- [ ] Quota utilization > 80%
- [ ] Daily API calls: 450 (build day), 0 (serve days)
- [ ] Weekly API calls: 450 (sustainable)

### Operational
- [ ] Cache survives API restarts (persistence)
- [ ] Weekly refresh automation
- [ ] Graceful quota exhaustion handling

---

## Risk Mitigation

### 1. Quota Exhaustion
- **Risk**: Alpha Vantage blocks API calls
- **Mitigation**: Cache serves users for 6 days
- **Fallback**: Graceful error messages

### 2. API Changes
- **Risk**: Alpha Vantage changes API
- **Mitigation**: Monitor API responses
- **Fallback**: Use cached data until fixed

### 3. Cache Corruption
- **Risk**: Cache data becomes invalid
- **Mitigation**: Validation checks
- **Fallback**: Rebuild cache from scratch

---

## Next Steps

### Immediate (This Week)
1. [ ] Implement Phase 1 (20 companies)
2. [ ] Test cache building with 20 companies
3. [ ] Extend cache TTL to 7 days
4. [ ] Add persistent cache storage

### Short Term (Next 2 Weeks)
1. [ ] Research top 450 companies
2. [ ] Design Phase 2 implementation
3. [ ] Add quota monitoring
4. [ ] Implement weekly refresh automation

### Long Term (Next Month)
1. [ ] Deploy Phase 2 (450 companies)
2. [ ] Monitor performance and user experience
3. [ ] Optimize based on usage patterns
4. [ ] Plan for paid API tier if needed 