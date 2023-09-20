import socketio from 'socket.io-client';
import { createContext } from 'react';
import { SOCKET_URL } from "@env";

let socket = socketio.connect(SOCKET_URL, {
  transports: ['websocket'],
  jsonp: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('connect', () => {
  console.log('@SOKET: Connected');
});

socket.on('connect_error', err => {
  console.log('@SOCKET: ERROR', err.message);
});

socket.on('disconnect', reason => {
  console.log('@SOCKET: Disconnect', reason);
});

export default socket;
export const SocketContext = createContext();
