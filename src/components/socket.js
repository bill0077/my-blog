import { io } from 'socket.io-client';

const URL = 'https://mybackendserverdomain.com';

export const socket = io(URL);