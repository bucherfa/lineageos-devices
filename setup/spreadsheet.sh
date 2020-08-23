#!/bin/bash
mkdir -p temp/spreadsheet/backup
SPREADSHEET_FILE=temp/spreadsheet/spreadsheet.csv
if test -f "$SPREADSHEET_FILE"; then
    cp $SPREADSHEET_FILE "temp/spreadsheet/backup/spreadsheet.$(date +%F_%R).csv"
fi
wget "https://docs.google.com/spreadsheets/d/1bx6RvTCEGn5zA06lW_uZGZ_dq6qQyCZC_NifmyeC1lM/export?format=csv&id=1bx6RvTCEGn5zA06lW_uZGZ_dq6qQyCZC_NifmyeC1lM&gid=0" -O $SPREADSHEET_FILE
