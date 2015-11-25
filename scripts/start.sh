#!/bin/bash

cd ~/website/

screen -S server -d -m npm run-script http
screen -S secure_server -d -m npm run-script https
