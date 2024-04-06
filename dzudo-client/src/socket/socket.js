import { io } from 'socket.io-client';
import { BASE_URL_SOCKET } from '../core/config/config';


const URL = BASE_URL_SOCKET;

export const socket = io(URL);