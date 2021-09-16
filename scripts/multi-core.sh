#!/bin/env bash

for init in {1..14}; do
  node ./js/generate-result.js $init &
done
