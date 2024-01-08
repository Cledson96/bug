import express, { Application } from 'express';
import { Server as HTTPServer, createServer as CreateHTTPServer } from 'http'
import { Server as HTTPSServer, createServer as CreateHTTPSServer } from 'https'
import Logger from '@util/logger';
import cors from 'cors'

import config from '@config';
import MainSocket from '../socket/interfaces/index.interface'
import SocketHandler from './server.socket'
import NotificacaoSocket from './interfaces/notificacao'
import ViewEdital from './interfaces/pesquisa/view-aviso'
import viewMovimentacao from './interfaces/pesquisa/view-movimentacao';

class SocketIOServer {
    private app: Application;
    private server?: HTTPServer | HTTPSServer;
    
    constructor() {
        this.app = express();
        this.initializeServer();
        this.initializeSockets();
    }

    private initializeServer(): void {
        this.app.use(cors())
        this.server = CreateHTTPServer(this.app);
    }

    private initializeSockets(): void {
        const io = SocketHandler.getInstance(this.server)

        io.initializeHandlers([
            { path: '/', handler: MainSocket},
            { path: '/view-aviso', handler: ViewEdital},
            { path: '/notificacao', handler: NotificacaoSocket},
            { path: '/view-movimentacao', handler: viewMovimentacao}
        ])
    }

    public start(): void {
        if (!this.server) throw new Error('Socket não inicializado');
        
        this.server.listen(config.port.socket, () => {
            Logger.info(`Socket ONLINE [${config.port.socket}]`);
        });
    }

    public emitSocketEvent(namespace: string, eventName: string, content: any, socketRoom?: string): void {
        const io = SocketHandler.getInstance().of(namespace);
    
        // if(!socketRoom) {
            io.emit(eventName, content);
            console.log('iajdisj');
            
    //     } else {
    //         io.to(socketRoom).emit(eventName, content);
    //     }
    }


}

export default new SocketIOServer()