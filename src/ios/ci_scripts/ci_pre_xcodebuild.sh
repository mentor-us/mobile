#!/bin/zsh

echo "🧩 Stage: PRE-Xcode Build is activated .... "

cd ..
yarn build:ios

# You can add additional scripts here...

echo "🎯 Stage: PRE-Xcode Build is DONE .... "

exit 0