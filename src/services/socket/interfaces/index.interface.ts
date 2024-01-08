import { DisconnectReason, Socket } from "socket.io";
import SocketInterface from "../socket.interface";

class MainSocket implements SocketInterface {

    handleConnection(socket: Socket): void {
        console.log(`Socket connected: ${socket.id}`);
        socket.on('disconnect', (socketDiscReason) => this.handleDisconnect(socketDiscReason, socket));
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

export default new MainSocket();