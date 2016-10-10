/**
 * Created by jahansj on 16/06/2016.
 */


module.exports = function (io) {

    io.on('connection', /* TODO isLoggedIn */ (socket) => {

        io.emit('thing', { data: 'thisisathing' });

        socket.on('message', data => {

            console.log(`distribute:channel-${data.id}: ${data.textContent}`);

            io.emit(`distribute:channel-${data.id}`, { username: data.username, textContent: data.textContent });
        });
    });
};