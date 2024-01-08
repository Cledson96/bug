import { UsuarioAttributes } from "atlasdb:types"

export {}
declare global {
    namespace Express {
        export interface Request {
            user: UsuarioAttributes //TODO: Verificar AUTH USER
        }
    }
        
}