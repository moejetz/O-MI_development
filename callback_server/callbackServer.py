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

#server data
address = '0.0.0.0'
port = 8284

# Count responses for convenience
responseNum = 1


# Prints seperation lines on the terminal
def seperator():
    print ("=" * 20 + " # {:02} # ".format(responseNum) + "=" * 20)


#sends HTTP request to toggle a network outlet
def togglePlug(mac, value):

    ip = str(requests.get('http://otaniemi3d.cs.hut.fi:8282/plugs/'+mac).text)
    print ("Toggle plug "+ip)
    r = requests.get('http://aalto:aalto@'+ip+'/xml/jsonswitch.php?id=1&set='+value)



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
            mac = infoItem.attributes['name'].value
            value = infoItem.getElementsByTagName("value")[0].firstChild.data

            togglePlug(mac, value)


        # Print response to terminal
        seperator()
        print(parsedMsg.toprettyxml(indent="  "))
        seperator()
        print ("\n")

        global responseNum
        responseNum += 1




httpd = HTTPServer((address, port), CallbackHandler)
print ('Listening on http://'+address+':'+str(port)+'/')
httpd.serve_forever()

