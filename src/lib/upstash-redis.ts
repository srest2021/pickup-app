import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://us1-pleased-kangaroo-41719.upstash.io',
  token: process.env.UPSTASH_TOKEN,
  responseEncoding: false,
});