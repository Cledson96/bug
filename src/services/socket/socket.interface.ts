import { Socket } from "socket.io";

interface SocketInterface {
    handleConnection(socket: Socket): void;
    handleDisconnection?(socket: Socket): void;
    implementation?(socket: Socket, next: any): void;
}

export default SocketInterface;
