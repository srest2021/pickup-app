import { themes, tokens } from '@tamagui/themes'
import { createTamagui } from 'tamagui'

const appConfig = createTamagui({
  themes,
  tokens
})

export type AppConfig = typeof appConfig
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}
export default appConfig