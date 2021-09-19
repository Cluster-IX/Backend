#!/bin/env bash

for init in {1..14}; do
  node ./js/import-results.js $init &
done
