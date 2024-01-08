import { DisconnectReason, Socket } from 'socket.io'
import SocketInterface from '../../socket.interface'

interface IViewEdital {
    aviso_id: number,
    usuario: number,
    nick: string,
}

let viewEdital: IViewEdital[] = []

class ViewEdital implements SocketInterface{
    
    handleConnection(socket: Socket): void {
        socket.on('eye', data => {
            
            const usuarioIndex = viewEdital.findIndex(item => item.usuario == data.usuario_id)
            if(usuarioIndex > -1){
                viewEdital.splice(usuarioIndex, 1)
            }
            viewEdital.push({
                aviso_id: data.aviso_id,
                usuario: data.usuario_id,
                nick: data.nick
            })

            socket.broadcast.emit('eye', viewEdital)
        })

        socket.on('dismount', data => {
            const usuarioIndex = viewEdital.findIndex(item => item.usuario == data.usuario)
            if(usuarioIndex > -1){
                viewEdital.splice(usuarioIndex, 1)
            }
            socket.broadcast.emit('eye', viewEdital)
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

export default new ViewEdital()