#!/bin/bash

if (($(ps -ef | grep "node ./bin/http" | grep -v "sh -c" | grep -v grep | wc -l) > 1))
  then
    echo -e "\e[0;32mServers are up."
    echo
  else
    echo -e "\e[0;31mOne of the servers was down... restarting."
    cd ~/website/
    screen -X -S server kill
    screen -X -S secure_server kill
    ./bin/start.sh
    echo -e "\e[0;32mServers restarted."
    echo
fi
