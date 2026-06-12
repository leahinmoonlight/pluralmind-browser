#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Chrome / Edge
yarn zip

# Firefox
yarn zip:firefox
