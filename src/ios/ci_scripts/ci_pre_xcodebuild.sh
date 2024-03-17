#!/bin/zsh

echo "🧩 Stage: PRE-Xcode Build is activated .... "

cd ../..
pwd

echo "🔨 Injected the .env file"

cat <<EOT >> .env
BASE_URL="https://mentor.somesandwich.rocks"
SOCKET_URL="https://mentor.somesandwich.rocks"
TOKEN="YOUR_TOKEN"
EOT

ls -a
cat .env

source .env

echo "🔨 Injected the .env file is DONE .... "

yarn run bundle:ios --verbose

# You can add additional scripts here...

echo "🎯 Stage: PRE-Xcode Build is DONE .... "

exit 0