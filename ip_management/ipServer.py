#!/usr/bin/python3
# -*- coding: utf-8 -*-

'''
This is an IP management server, used with O-MI (https://github.com/AaltoAsia/O-MI).
It stores tuples of IP- and MAC addresses of Allnet All3073 outlets.
These outlets will inform this server every time their IP address change.
This is neccessary because the IP addresses will be assigned dynamically.
Therefore, in the O-MI node there will be stored only the MAC addresses, on which other instances can request the related IP addresses from this server.

This server is part of a project from Kary Främling.
The goal is to create a test implementation of O-MI for one room at the Aalto University,
to act as a reference implementation and base for further projects concerning room automation for the whole University.

Note: only works with python3, required dependencies: requests, bottle, bottle-sqlite

Written by Moritz Kraus, 2015
'''


from bottle import route, run, template, request
import bottle.ext.sqlite

#register sqlite plugin
app = bottle.Bottle()
plugin = bottle.ext.sqlite.Plugin(dbfile='database.db')
app.install(plugin)


################ routes ################


#factory reset database
#this is commented out for security reasons. If needed, just comment in and restart the server.
'''
@app.route('/setup')
def setup(db):

    try:

        #delete old table
        db.execute('PRAGMA writable_schema = 1;').fetchone()
        db.execute('DELETE FROM sqlite_master WHERE type = "table";').fetchone()
        db.execute('PRAGMA writable_schema = 0;').fetchone()
        db.execute('VACUUM;').fetchone()
        db.execute('PRAGMA INTEGRITY_CHECK;').fetchone()

        #create new table
        db.execute('CREATE TABLE plugs(mac varchar(255) PRIMARY KEY, ip varchar(255))').fetchone()

        return str(True)

    except Exception as e:
        print (e)
        return str(False)
'''





@app.route('/plugs/<mac>')
def getPlugIp(mac, db):
    row = db.execute('SELECT * from plugs where mac=?', (mac,)).fetchone()
    return row[1]



@app.route('/plugs', method='POST')
def insertOrUpdatePlug(db):

    try:
        mac = request.forms.get('mac')
        ip = request.forms.get('ip')

        db.execute('INSERT OR REPLACE INTO plugs VALUES (?,?)', (mac, ip)).fetchone()
        return str(True)

    except Exception as e:
        print (e)
        return str(False)





app.run(host='0.0.0.0', port=8282)
