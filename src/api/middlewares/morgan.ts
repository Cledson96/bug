import { RequisicoesService } from "@api/modules/requisicoes/services";
import { RequisicoesAttributes } from "atlas-orm/build/schemas/interfaces";
import morgan, { StreamOptions } from "morgan";

const stream: StreamOptions = {
    write: async (message) => {
        const requestions = JSON.parse(message)

        const methods: { [key: string]: string } = {
            'POST': 'Criação',
            'PUT': 'Atualização',
            'DELETE': 'Exclusão',
        };

        const payload: RequisicoesAttributes = {
            metodo: requestions.metodo,
            status: requestions.status,
            momento: new Date(),
            ip: requestions.ip,
            url: requestions.url,
            usuario_id: 1,
            acao: methods[requestions.metodo] || 'Outro'
        }

        await RequisicoesService.create(payload)
    }
}

const skip = (req: any) => {
    return req.method === 'GET'
}

//TODO Pegar o IP da solicitação

const morganMiddleware = morgan(
    '{"metodo": ":method", "url": ":url", "status": ":status", "data": "[:date[web]]", "res": ":res[content-length]", "time": ":response-time ms", "ip": ":remote-addr"}',
    { stream, skip }
)

export default morganMiddleware;