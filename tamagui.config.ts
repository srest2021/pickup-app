// import { themes, tokens } from '@tamagui/themes'
// import { createTamagui } from 'tamagui'

// const appConfig = createTamagui({
//   themes,
//   tokens
// })

// export type AppConfig = typeof appConfig
// declare module '@tamagui/core' {
//   interface TamaguiCustomConfig extends AppConfig {}
// }
// export default appConfig

import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui"; // or '@tamagui/core'

const appConfig = createTamagui(config);
export type AppConfig = typeof appConfig;

declare module "tamagui" {
  // or '@tamagui/core'
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
