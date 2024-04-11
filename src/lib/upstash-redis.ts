import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://us1-pleased-kangaroo-41719.upstash.io',
  token: 'AaL3ASQgYzVmNDExZTEtMGI4Yi00YTQ4LTkwNTUtNmY2NzgzNmJkZDA3ODU0MDQ4YzczZmE4NDg5Yzg4ODAyMTA0OGU4NTIzNGQ=',
  responseEncoding: false,
});