var socket = io()

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});