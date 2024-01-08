import { Socket } from 'socket.io'
import SocketInterface from '../socket.interface'
import notificacao from "@api/modules/notificacao/services/notificacao"

interface UserSocket {
    id: number,
    cliente: { id: number },
}

interface INotificacao {
    id: number,
    notificacao_id: number,
    usuario_id: number
}

class NotificacaoSocket implements SocketInterface {

    handleConnection(socket: Socket): void {
        socket.on('markAsRead', (id: number) => this.handleMarkAsRead(id))
        socket.on('createComment', (notification: any) => this.handleCreateComment(notification, socket))
    }

    handleMarkAsRead(id: number): void {
        notificacao.markAsRead(id)
    }

    async handleCreateComment(notification: any, socket: Socket) {
        
        if (!notification.userMentioned) return
        
        return await notification.userMentioned.map((u: any) => {
            try {
                notificacao.create({
                    conteudo: `${notification.user} mencionou você em um comentário.`,
                    lida: false,
                    usuario_id: u.id,
                    tipo_id: 2
                })
            } catch (error) {
                console.log(error);
            }
        })
    }

    middlewareImplementation(socket: Socket, next: any): void {
        return next()
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

export default new NotificacaoSocket();