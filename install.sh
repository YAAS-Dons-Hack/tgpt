#!/bin/bash

npm install
make

echo "alias tgpt='node $(pwd)/dist/tgpt.js'" >> $HOME/.bashrc
source $HOME/.bashrc

exec bash
