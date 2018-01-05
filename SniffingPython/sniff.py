import asyncio
import datetime
import websockets
import ujson as json

import subprocess
import sys
import re

def sniffer():
    cmd = 'tcpdump -i en0 -I -l -e'.split()
    print('Starting sniffer...')
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    for line in iter(process.stdout.readline, ''):
        line = line.decode('ascii')
        match = re.search('SA:([^ ]+) .+? Probe Request \(([^\)]+)\)', line)
        msg = {'length':len(line)}
        if match:
            msg['mac'] = match.group(1)
            msg['ssid'] = match.group(2)
        yield msg

async def sender(websocket, path):
    print('Starting sender...')
    for msg in sniffer():
        await websocket.send(json.dumps(msg))

try:
    start_server = websockets.serve(sender, '127.0.0.1', 5678)
    asyncio.get_event_loop().run_until_complete(start_server)
    print('Ready for connections.')
    asyncio.get_event_loop().run_forever()

except KeyboardInterrupt:
    start_server.ws_server.close()