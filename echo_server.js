/**
 * Created by Administrator on 2016/10/25.
 */

var net = require('net');
var server = net.createServer(function (socket) {
    socket.once('data', function (data) {
        console.log('接收到数据了：');
        console.log(data);
        socket.write(data);
    });
});

server.listen(8888);















