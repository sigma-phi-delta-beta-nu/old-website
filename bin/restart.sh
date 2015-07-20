#!/bin/bash

if (($(ps -ef | grep "node ./bin/http" | grep -v "sh -c" | grep -v grep | wc -l) > 1))
  then
    echo "Servers are up.\n"
  else
    cd ~/dev/
    screen -X -S server kill
    screen -X -S secure_server kill
    ./bin/start.sh
    echo "Servers restarted.\n"
fi
