#!/bin/bash

if (($(ps -ef | grep "node ./bin/server/http" | grep -v "sh -c" | grep -v grep | wc -l) > 1))
  then
    echo "Servers are up."
    echo
  else
    echo "One of the servers was down... restarting."
    cd ~/website/
    screen -X -S server kill
    screen -X -S secure_server kill
    ./start.sh
    echo "Servers restarted."
    echo
fi
