import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config();

const redisClient= new Redis(process.env.REDIS_URL);

redisClient.on("error", (err) => {
    console.log("Redis connection error", err);
});
redisClient.on("connect", () => {
    console.log("Redis connected");
}); 

redisClient.on("end", () => {
    console.log("Redis connection closed");
});

process.on("SIGINT", () => {
    redisClient.quit();
    process.exit(0);
});

export default redisClient; 