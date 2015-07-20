#!/bin/bash

if (($(ps -ef | grep "node ./bin/http" | grep -v "sh -c" | grep -v grep | wc -l) > 1))
  then
    #green text
    echo -e "\e[1;32mServers are up."
    echo
  else
    #red text
    echo -e "\e[1;31mOne of the servers was down... restarting."
    cd ~/website/
    screen -X -S server kill
    screen -X -S secure_server kill
    ./bin/start.sh
    #green text
    echo -e "\e[1;32mServers restarted."
    echo
fi
