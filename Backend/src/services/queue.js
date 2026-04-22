import Redis from "ioredis"

const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
    maxRetriesPerRequest: null 
})

redis.on("connect", () => console.log("Redis connected successfully"))
redis.on("error", (err) => console.error("Redis connection error:", err))

const taskQueue = {
    add: async (name, data) => {
        await redis.lpush("task_queue", JSON.stringify(data))
    }
}

export default taskQueue