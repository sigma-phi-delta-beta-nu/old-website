#!/bin/bash

Green = '\e[0;32m'
Red = '\e[0;31m'

if (($(ps -ef | grep "node ./bin/http" | grep -v "sh -c" | grep -v grep | wc -l) > 1))
  then
    echo -e "${Green}Servers are up."
    echo
  else
    echo -e "${Red}One of the servers was down... restarting."
    cd ~/website/
    screen -X -S server kill
    screen -X -S secure_server kill
    ./bin/start.sh
    echo -e "${Green}Servers restarted."
    echo
fi
