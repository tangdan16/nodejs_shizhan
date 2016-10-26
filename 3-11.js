/**
 * Created by Administrator on 2016/10/25.
 */

var events = require('events');
var net = require('net');
var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id,client) {
    console.log('join');
    this.clients[id] = client;
    this.subscriptions[id] = function (senderId,message) {
        if(id!=senderId){
            this.clients[id].write(message);
        }
    }
    this.on('broadcast',this.subscriptions[id]);
});

channel.on('leave', function (id) {
    channel.removeListener('broadcast',this.subscriptions[id]);
    channel.emit('broadcast',id,id+" has left the chat.\n");
});

channel.on('shutdown', function () {
    channel.emit('broadcast','','Chat has shut down.\n');
    channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
    var id = client.remoteAddress + ':' + client.remotePort;

    channel.emit('join',id,client);

    client.on('data', function (data) {
        data = data.toString();
        console.log(data);
        if(data == "s"){
            channel.emit('shutdown');
        }

        channel.emit('broadcast',id,data);
    });

    client.on('close', function () {
        channel.emit('leave',id);
    });
});

server.listen(8888);



















