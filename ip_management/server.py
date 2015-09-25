#!/usr/bin/python3

from bottle import route, run, template, request
import bottle.ext.sqlite

#register sqlite plugin
app = bottle.Bottle()
plugin = bottle.ext.sqlite.Plugin(dbfile='database.db')
app.install(plugin)


################ routes ################


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






app.run(host='0.0.0.0', port=9999, debug=True)
