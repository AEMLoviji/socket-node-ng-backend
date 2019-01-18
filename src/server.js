import { Config } from './config/config';
import { SocketServer } from './socketServer';

const http=require('http');

var config = new Config()
    .setPort(3500);

new SocketServer(config)
    .build()
    .start();   