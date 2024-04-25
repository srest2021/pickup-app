import { Redis } from "@upstash/redis";
import { Message, OtherUser } from "./types";

export const MESSAGE_LIMIT = 2000;
export const OTHER_USER_LIMIT = 50;
const EXPIRATION_TIME = 7200;

export const redis = new Redis({
  url: "https://us1-pleased-kangaroo-41719.upstash.io",
  token: process.env.UPSTASH_TOKEN as string,
  responseEncoding: false,
});

export const getChatroomCacheKey = (roomCode: string | null) => {
  return `room:${roomCode}`;
};

export const addMessageToCache = async (cacheKey: string, payload: any) => {
  await redis.lpush(cacheKey, payload);
  await redis.ltrim(cacheKey, 0, MESSAGE_LIMIT);
};

export const addMessagesToCache = async (
  cacheKey: string,
  messages: Message[],
) => {
  await redis.lpush(cacheKey, ...messages);
  await redis.ltrim(cacheKey, 0, MESSAGE_LIMIT);
};

export const getOtherUserCacheKey = (userId: string) => {
  return `otherUser:${userId}`;
};

export const addUserToCache = async (user: OtherUser) => {
  const cacheKey = getOtherUserCacheKey(user.id);
  await redis.hset(cacheKey, user);
  await redis.expire(cacheKey, EXPIRATION_TIME);
};

export const addUsersToCache = async (users: OtherUser[]) => {
  users.forEach(async (user) => await addUserToCache(user));
};

export const getUserFromCache = async (userId: string) => {
  const cacheKey = getOtherUserCacheKey(userId);
  const data: OtherUser | null = await redis.hgetall(cacheKey);
  return data;
};

export const updateIsFriendInCache = async (
  userId: string,
  isFriend: boolean,
) => {
  const cacheKey = getOtherUserCacheKey(userId);
  const data: OtherUser | null = await redis.hgetall(cacheKey);
  if (data) {
    data.isFriend = isFriend;
    await redis.hset(cacheKey, data);
  }
};

export const updatehasRequestedInCache = async (
  userId: string,
  hasRequested: boolean,
) => {
  const cacheKey = getOtherUserCacheKey(userId);
  const data: OtherUser | null = await redis.hgetall(cacheKey);
  if (data) {
    data.hasRequested = hasRequested;
    await redis.hset(cacheKey, data);
    await redis.expire(cacheKey, EXPIRATION_TIME);
  }
};
