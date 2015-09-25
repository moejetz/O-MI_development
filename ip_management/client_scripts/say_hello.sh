#!/bin/sh

#get initial data
ip=`ifconfig br0 | awk '/inet addr/{printf substr($2,6)}'`
mac=`ifconfig br0 | egrep -o '([[:xdigit:]]{2}[:]){5}[[:xdigit:]]{2}'`


while true; do

  #get current assigned ip
  tmp_ip=`ifconfig br0 | awk '/inet addr/{printf substr($2,6)}'`

  #check for changes
  if [ "$ip" = "$tmp_ip" ]; then
    echo "ip did not change!"

    #FOR TESTING - REMOVE FOR PRODUCTION!
    ip="false_ip"

  else

    #ip has changed, inform server
    echo "ip changed!"
    ip="$tmp_ip"

    data="mac=$mac&ip=$ip"
    curl --data "$data" http://130.233.193.135:9999

  fi;

  #sleep a short while
  sleep 2

done
