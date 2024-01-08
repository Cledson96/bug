import { Socket, Server } from "socket.io"

const socketCors = {
    origin: "*"
}

class SocketHandler extends Server {
    private static instance: SocketHandler

    private constructor(server: any){
        super(server, { cors: socketCors })
    }

    public static getInstance(server?: any): SocketHandler {
        if(!SocketHandler.instance){
            SocketHandler.instance = new SocketHandler(server)
        }

        return SocketHandler.instance
    }

    public async initializeHandlers(socketHandlers: Array<any> ){
        socketHandlers.forEach(el => {
            const namespace = SocketHandler.getInstance().of(el.path, (socket: Socket) => el.handler.handleConnection(socket))
            
            if(!el.handler.implementation){
                throw new Error('Falha ao iniciar namespace')
            }

            namespace.use(el.handler.implementation)

        })
    }
}

export default SocketHandler;