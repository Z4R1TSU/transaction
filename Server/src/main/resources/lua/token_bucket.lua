local key = KEYS[1]
local rate = tonumber(ARGV[1]) -- tokens per second
local capacity = tonumber(ARGV[2]) -- max tokens
local now = tonumber(ARGV[3]) -- current timestamp in seconds
local requested = tonumber(ARGV[4]) -- tokens requested

local last_tokens = tonumber(redis.call('get', key))
if last_tokens == nil then
    last_tokens = capacity
end

local last_refreshed = tonumber(redis.call('get', key .. ':ts'))
if last_refreshed == nil then
    last_refreshed = 0
end

local delta = math.max(0, now - last_refreshed)
local filled_tokens = math.min(capacity, last_tokens + (delta * rate))
local allowed = filled_tokens >= requested
local new_tokens = filled_tokens
if allowed then
    new_tokens = filled_tokens - requested
end

redis.call('set', key, new_tokens)
redis.call('set', key .. ':ts', now)

return allowed
