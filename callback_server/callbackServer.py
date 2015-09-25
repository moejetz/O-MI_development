#!/usr/bin/python3
# -*- coding: utf-8 -*-

'''
This is a callback server for O-MI (https://github.com/AaltoAsia/O-MI).
It is based on https://github.com/AaltoAsia/O-MI/blob/master/callbackTestServer.py
This server can react to incoming O-MI Node callback responses and send HTTP requests to toggle network outlets.

The callback server is part of a project from Kary Främling.
The goal is to create a test implementation of O-MI for one room at the Aalto University,
to act as a reference implementation and base for further projects concerning room automation for the whole University.

Note: only works with python3, required dependencies: requests

Written by Moritz Kraus, 2015
'''


from http.server import *
from xml.dom import minidom
import requests


# Count responses for convenience
responseNum = 1

# Prints seperation lines on the terminal
def seperator():
    print ("=" * 20 + " # {:02} # ".format(responseNum) + "=" * 20)


#sends HTTP request to toggle a network outlet
def togglePlug(value):
    print ("Toggle plug...")
    r = requests.get('http://aalto:aalto@130.233.193.114/xml/jsonswitch.php?id=1&set='+value)



# Simple Handler for HTTP POST callbacks
class CallbackHandler(BaseHTTPRequestHandler):
    def do_POST(s):
        # We should tell the O-MI node that we received the message
        s.send_response(200)
        s.end_headers()

        # Read all content
        content_len = int(s.headers['content-length'])
        post_body = s.rfile.read(content_len)
        msg = post_body.decode("UTF-8")

        #XML parsing stuff
        parsedMsg = minidom.parseString(msg)
        for infoItem in parsedMsg.getElementsByTagName('InfoItem'):
            name = infoItem.attributes['name'].value
            value = infoItem.getElementsByTagName("value")[0].firstChild.data

            if(name[:4]=="Plug"):
                togglePlug(value)



        # Print response to terminal
        seperator()
        print(parsedMsg.toprettyxml(indent="  "))
        seperator()
        print ("\n")

        global responseNum
        responseNum += 1




server_address = ('', 5432)
httpd = HTTPServer(server_address, CallbackHandler)
httpd.serve_forever()
