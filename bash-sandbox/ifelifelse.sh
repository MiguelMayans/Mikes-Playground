#!/bin/bash

if [ ${1,,} == miguel]; then
  echo "Welcome Miguel, you are a panther"
elif [ ${1,,} == jose ]; then
  echo "Welcome Jose, pity you are not Miguel"
else
  echo "Welcome $1, pity you are not Miguel or Jose"
fi

// case statement

case ${1,,} in
miguel | admin)
  echo "Welcome Miguel, you are a panther"
  ;;
help)
  echo "You need help, sorry I can't help you"
  ;;
*)
  echo "message for all other cases"
  ;;
esac
