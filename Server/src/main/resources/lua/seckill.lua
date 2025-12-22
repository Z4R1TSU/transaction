local stockKey = KEYS[1]
local userKey = KEYS[2]
local userId = ARGV[1]
local quantity = tonumber(ARGV[2])

-- Check if user already bought
if redis.call('sismember', userKey, userId) == 1 then
    return -1
end

-- Check stock
local stockVal = redis.call('get', stockKey)
if not stockVal then
    return -2
end

local stock = tonumber(stockVal)
if stock < quantity then
    return 0
end

-- Deduct stock
redis.call('decrby', stockKey, quantity)
-- Add user to bought list
redis.call('sadd', userKey, userId)

return 1
