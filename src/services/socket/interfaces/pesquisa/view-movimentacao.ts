import { DisconnectReason, Socket } from 'socket.io'
import SocketInterface from '../../socket.interface'

interface IViewMovimentacao {
    icon: string,
    nick: string,
    status: string,
    color: string,
    usuario: number,
    aviso_id: number
}

let viewInteresse: IViewMovimentacao[] = []

class ViewMovimentacao implements SocketInterface{

    handleConnection(socket: Socket): void {
        socket.on('movimentacao', data => {
            viewInteresse.push({
                icon: data.icon,
                nick: data.nick,
                status: data.status,
                color: data.color,
                usuario: data.usuario_id,
                aviso_id: data.aviso_id
            })

            socket.broadcast.emit('movimentacao', viewInteresse)
        })
    }

    handleDisconnect(socketDiscReason: DisconnectReason, socket: Socket): void {
        console.log(`Socket disconnected: ${socketDiscReason}`);
    }

    implementation(socket: Socket, next: any): void {
        try {
            return next();
        } 
        catch (error) {
            return next(error);
        }
    }

}

export default new ViewMovimentacao()