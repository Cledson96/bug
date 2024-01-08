import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import {Server as HTTPServer, createServer as createServerHTTP} from 'http';
import {Server as HTTPSServer, createServer as createServerHTTPS} from 'https';
import { readFileSync } from'fs';

import config from '@config';
import Logger from '@util/logger';

//* Custom Middlewares
import morgan from '../src/api/middlewares/morgan';
import errorHandler from '@api/middlewares/errorHandler';

// * Database
import { Atlas } from './database';

//* Cron
import { Cron } from '@service/cron';
import { NotificationCron, ParticipacaoCron } from '@service/cron/jobs';

// * Routes
import routes from './api/routes';

//* Socket
import Socket from './services/socket/index';

class App {
   
    private app: Application;
    private server?: HTTPServer | HTTPSServer;

    constructor() {
        console.log("Teste")
        this.app = express();
        this.middleware();
        this.routes();
        this.createServer();
        this.cronJobs();
    }

    private createServer(): void {
        if (config.env === 'dev') this.server = createServerHTTP(this.app);
        else {
            this.server = createServerHTTPS({
                key: readFileSync('/certs/key.pem'),
                cert: readFileSync('/certs/cert.pem')
            }, this.app);
        }
    }

    private middleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(compression());
        this.app.use(cors({
            allowedHeaders: ['Authorization', 'Content-Type', 'tarefas-type']
        }));
        this.app.use(helmet());
        this.app.use(morgan);
    }

    private routes(): void {
        this.app.get('/', (req, res) => res.send('Hello World'));
        this.app.use('/api', routes);

        this.app.use(errorHandler.handleException)
    }

    private cronJobs(): void {
        const cronJobs = [
            { name: 'Participação Lance/Pós-lance', cron: ParticipacaoCron },
            { name: 'Notificações', cron: NotificationCron }
        ];
        
        cronJobs.forEach(job => Cron.start(job));
    }

    public async start(): Promise<void> {
        try {
            await Atlas.synchronize(config.database.scope, !true, true);
            Socket.start();
            this.server!.listen(config.port.server, () => { 
                Logger.info(`Sistema Atlas ONLINE [${config.port.server}]`);
                Logger.info(`Ambiente: ${config.env.toUpperCase()}`)
            });
        }
        catch (error) {
            Logger.error(error.message);
        }
    }
}

export default new App();