#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cp -r $SCRIPT_DIR/../../../node_modules/@fontsource/* $SCRIPT_DIR/../templates/common/
