# Building the iOS App

**Prerequisites:**

- Follow the instructions in the React Native documentation to set up the environment: [Setup Environment](https://reactnative.dev/docs/0.70/environment-setup).

## Running the Application Locally (Using terminal)

- Obtain the backend URL and replace the `API_URL` and `SOCKET_URL` in the `.env` file:

  - **Note:** If the backend is running locally,
    - Use the local IP instead of `localhost`, for example, `127.0.0.1`.

- Navigate to the `src/` folder and execute the following commands in the terminal:

```shell
yarn install
cd ios
bundle install
pod install
cd ..
# You will need two terminal windows; one for running 'yarn start' and another for 'yarn android'
yarn start
yarn ios
```

## Running the Application Locally (Xcode)

- Build and run the application in Xcode after the `cd ..` step.

## Helpful Commands

- To clean the iOS pod files and build:

```shell
rm -rf Podfile.lock Pods build
```

- To update the Podfile and reinstall pods:

```shell
pod install --repo-update
```
