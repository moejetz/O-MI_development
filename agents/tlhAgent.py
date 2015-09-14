#!/bin/env python3
# -*- coding: utf-8 -*-

'''
This is an external agent for O-MI (https://github.com/AaltoAsia/O-MI).
It is based on https://github.com/AaltoAsia/O-MI/blob/master/agentExample.py
Currently implemented sensors are temperature, light and humidity.

The agent is part of a project from Kary Främling.
The goal is to create a test implementation of O-MI for one room at the Aalto University,
to act as a reference implementation and base for further projects concerning room automation for the whole University.

Note: only works with python3.

Written by Moritz Kraus, 2015
'''

from socket import create_connection
import time
import io
import sys

#connection data
omi_node_ip = "130.233.193.113"
omi_node_external_agent_port = 8181
sleepTime = 5

#check arguments
verbose=False
startMessage = '\r\n=================\r\n[Starting agent]\r\n================='
if(len(sys.argv)>1):
	if('-h' in sys.argv or '--help' in sys.argv):
		print ('\r\nPossible arguments:\r\n-h | --help: show these information\r\n-d | --verbose: show verbose information\r\n')
		exit(0)

	if(sys.argv[1]=='-v' or sys.argv[1]=='--verbose'):
		startMessage = ('\r\n=================================\r\n[Starting agent in verbose mode]\r\n=================================')
		verbose=True
print (startMessage)


#open connection to o-mi node
connection = create_connection((omi_node_ip, omi_node_external_agent_port))


try:
    while True:

        #get current values
        temperature = io.open('/mnt/1wire/26.595D45010000/temperature', 'r').read().strip()
        light 		= io.open('/mnt/1wire/26.595D45010000/VAD', 'r')		.read().strip()
        humidity 	= io.open('/mnt/1wire/26.DD4DCB010000/humidity', 'r')	.read().strip()

        #verbose output
        if(verbose):
            print ('Temperature:\t\t', temperature)
            print ('Light:\t\t\t', light)
            print ('Humidity:\t\t', humidity)
            print ('=================================')

        odf_message = b'''
            <Objects xmlns="odf.xsd">
                <Object>
                    <id>CS Building - B126</id>
                    <InfoItem name="temperature">
                        <value>''' +\
                        	bytes(temperature, "utf-8") +\
                        b'''</value>
                    </InfoItem>
                    <InfoItem name="light">
                        <value>''' +\
                        	bytes(light, "utf-8") +\
                        b'''</value>
                    </InfoItem>
                    <InfoItem name="humidity">
                        <value>''' +\
                            bytes(humidity, "utf-8") +\
                        b'''</value>
                    </InfoItem>
                </Object>
            </Objects>'''

        #send new data and wait for 15 seconds
        connection.sendall(odf_message)
        time.sleep(sleepTime)

except Exception as e:
    print (e)
    print ('Shutting down agent...')
    exit(0)