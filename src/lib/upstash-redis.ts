import { Redis } from "@upstash/redis";
import { OtherUser } from "./types";

export const MESSAGE_LIMIT = 50;
export const OTHER_USER_LIMIT = 50;

export const redis = new Redis({
  url: "https://us1-pleased-kangaroo-41719.upstash.io",
  token: process.env.UPSTASH_TOKEN,
  responseEncoding: false,
});

export const getUserCacheKey = (userId: string) => {
  return `otherUser:${userId}`;
};

// TODO: add TTL for users or flush cache on app start
// and/or add refresh for otherProfile that ignores existing object in cache
// and/or on change to isFriend or hasRequested, update user in cache by setting to OtherUser

export const addUserToCache = async (user: OtherUser) => {
  const cacheKey = getUserCacheKey(user.id);
  await redis.hset(cacheKey, user);
};

export const addUsersToCache = async (users: OtherUser[]) => {
  users.forEach(async (user) => await addUserToCache(user));
};

export const getUserFromCache = async (userId: string) => {
  const cacheKey = getUserCacheKey(userId);
  const data: OtherUser | null = await redis.hgetall(cacheKey);
  return data;
};

export const updateIsFriendInCache = async (userId: string, isFriend: boolean) => {
  //console.log("updating isFriend in cache")
  const cacheKey = getUserCacheKey(userId);
  const data: OtherUser | null = await redis.hgetall(cacheKey);
  if (data) {
    data.isFriend = isFriend;
    //console.log("updated data: ",data)
    await redis.hset(cacheKey, data);
  }
}

export const updatehasRequestedInCache = async (userId: string, hasRequested: boolean) => {
  //console.log("updating isFriend in cache")
  const cacheKey = getUserCacheKey(userId);
  const data: OtherUser | null = await redis.hgetall(cacheKey);
  if (data) {
    data.hasRequested = hasRequested;
    //console.log("updated data: ",data)
    await redis.hset(cacheKey, data);
  }
}

// export const getLocalAvatarUrlFromCache = async (userId: string) => {
//   const cacheKey = getUserCacheKey(userId);
//   const data = await redis.hget(cacheKey, 'localAvatarUrl');
//   return data;
// }
