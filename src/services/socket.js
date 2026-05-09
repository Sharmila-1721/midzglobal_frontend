import { io } from 'socket.io-client';

/* =========================
   SOCKET CONNECTION
========================= */

const socket = io(

  'http://localhost:8080',

  {

    transports: ['websocket'],

    autoConnect: true

  }

);

/* =========================
   CONNECTION EVENTS
========================= */

socket.on('connect', () => {

  console.log(

    'Socket Connected:',
    socket.id

  );

});

socket.on('disconnect', () => {

  console.log(
    'Socket Disconnected'
  );

});

/* =========================
   ERROR HANDLING
========================= */

socket.on('connect_error', (error) => {

  console.log(

    'Socket Connection Error:',

    error.message

  );

});

export default socket;