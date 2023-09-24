    # How to setup mobile
    Tags: Guides and Processes, Infrastructure

    # Requirement

    -   Linux yammy 20.04 … recommend
    -   Ram: minimum 16 gb ram
    -   Space disk minimum: 80GB
    -   Optional: physical device
    -   Yarn package
    -   Android Studio

    ### Setup mobile

    -   Pull source from the github
    -   Install Android studio
        -   Android SDK
        -   Android SDK platform
            -   `Intel x86 Atom_64 System Image` or `Google APIs Intel x86 Atom System Image`(recommend)
        -   Virtual device
    -   **Configure the ANDROID_HOME environment variable**
        -   ## Add the following lines to your `$HOME/.bash_profile` or `$HOME/.bashrc` (if you are using `zsh` then `~/.zprofile` or `~/.zshrc`) config file
            export ANDROID_HOME=$HOME/Android/Sdk
            export PATH=$PATH:$ANDROID_HOME/emulator
            export PATH=$PATH:$ANDROID_HOME/platform-tools
            Run echo **ANDROID_HOME** to verify success
    -   **Install Watchman**

        -   sudo apt install watchman

    -   **Set up source**
        -   **Locate src Mobile**
            -   yarn install
            -   yarn all-android
            -   yarn start
            -   yarn android

    **Must turn on the Backend server**

    if socket error, you must run 2 commands below

    -   adb reverse tcp:8080 tcp:8080
        adb reverse tcp:8085 tcp:8085

    -   **Reference**
        -   [https://reactnative.dev/docs/environment-setup?os=linux](https://reactnative.dev/docs/environment-setup?os=linux)
