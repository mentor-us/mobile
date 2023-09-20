## Before setup react-native environment I recommend you install 'node', 'npm', 'yarn' on your personal computer!

- For setup 'npm' and 'node', your should install 'nvm', 'nvm' is a good tool for managing Node versions on your device!
- Your can install yarn after install 'npm' by 'nvm': just input `npm install --global yarn` on your terminal =)).

  - nvm version: 0.39.2
  - node version: v16.18.0
  - npm version: 8.19.0
  - yarn version: 1.22.19

## Setup environment for coding react-native:

    - In order to setup environment for coding react-native, the best-recommended way that you can set up it is following this document 'https://reactnative.dev/docs/environment-setup', but in this document have 2 options, first options is Expo Go, second is React Native CLI.
    - In this project, we use React Native CLI for long-term support and scalable ability!
    - Absolutely, you have to set up combo "android studio + java" or "xcode" or both of them!

## How to run this project after setup environment?

    - You can see file package.json in this project after cloned, this file represent all package, library used in this project!
    - Just believe in the God following lines will help you run this project 'easily':
        - 'yarn all': for delete node-module and reinstall it, futhermore it delete all caches data and reset ios & android environment!
        - 'yarn all-android': similar to 'yarn all', but it just reset android environment!
        - 'yarn all-ios': similar to 'yarn all', but it just reset ios environment!
        - 'yarn start': similar to 'npm start' in nodejs or reactjs, it run a server, that supply services to sync and fast-refresh your code with your app on simulator!
        - 'yarn generate-splash-screen': run it just one time when you clone project, an run it after yarn all | yarn android | yarn ios.
        - 'yarn ios': build app on ios emulator.
        - 'yarn android': build app on android emulator (If your programming on window or ubuntu, you have to start your emulator first).

    - How to start emulator on ubuntu without start android studio:
        - Changes dir to Android/Sdk/emulator/
        - Run ./emulator -avd {your emulator name}. Example: ./emulator -avd Pixel3.

    - How to build app on physical android device:
        - You have to install 'adb' on your personal computer!
        - Connect your android devices with your personal computer!
        - Run 'adb devices' on your terminal: example result look like `be2f2a9 device`. So be2f2a9 is your device ID.
        - Run 'npx react-native run-android --deviceId=be2f2a9' for build app on your physical device.
        - There are a tips for run it easily: just add  'npx react-native run-android --deviceId=be2f2a9' on scripts of package.json file.
            example your can see the following line in package.json
                 "note7": "npx react-native run-android --deviceId=be2f2a9"
            and just run: 'yarn note7', (note7 is the name I have for my phone!).

29/01/2023: add new package: react-native-render-html, text-clipper, html-entities
