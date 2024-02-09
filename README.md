# Name of the app 

A brief description of it (elevator pitch goes here).

## Installing / Getting started

A quick introduction of the minimal setup you need to get the app up & running on a local computer. For example, your advisor might use the instruction here to run the application locally.

```shell
commands here
```

## Developing

Detailed and step-by-step documentation for setting up local development. For example, a new team member will use these instructions to start developing the project further. 

You should include what is needed (e.g. all of the configurations) to set up the dev environment. For instance, global dependencies or any other tools (include download links), explaining what database (and version) has been used, etc. If there is any virtual environment, local server, ..., explain here. 

Additionally, describe and show how to run the tests, explain your code style and show how to check it.

1. Run `npm install`.

2. To use the Expo Go app: 

    a. Download the Expo Go app on your phone.

    b. Run `npx expo start --go`.
    
    c. Scan the QR code with the Expo Go app (Android) or the Camera app (iOS) and open the link.

3. To locally build the project:

    a. On iOS, to run the simulator on Xcode:

    `expo prebuild --platform ios`

    `npx expo run:ios`

    b. On Android (not tested yet):

    `expo prebuild --platform android`

    `npx expo run:android`