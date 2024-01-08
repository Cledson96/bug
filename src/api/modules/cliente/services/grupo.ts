import { ClienteGrupoCreationAttributes, ClienteGrupoUpdateAttributes } from "atlasdb:types";
import { ClienteGrupo } from "atlasdb:models";
import { ClienteGrupoRepository } from "atlasdb:repositories";
import { FindOptions, Op } from "sequelize";

function formatarNome(nome:string): string {
  
    let palavras = nome.split(' ');
  
    let nomeFormatado = palavras.map(function(palavra:string) {
      
      return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    });
  
 
    return nomeFormatado.join(' ');
  }

class ClienteGrupoService {
    private ClienteGrupoRep: ClienteGrupoRepository;
    constructor() {
        this.ClienteGrupoRep = new ClienteGrupoRepository();
    }

    async find(options?: FindOptions): Promise<ClienteGrupo[]> {
        return await this.ClienteGrupoRep.findAll(options)
    }

    async findOne(options: FindOptions): Promise<ClienteGrupo | null> {
        if(!options.where) throw new Error('Where is required')
        return await this.ClienteGrupoRep.findOne(options)
    }
    
    async create(payload: ClienteGrupoCreationAttributes): Promise<ClienteGrupo> {
        if(payload.nome == undefined || payload.nome == '') throw new Error('Nome é obrigatório')
        if(payload.email == undefined || payload.email == '') throw new Error('Email é obrigatório')
        if(payload.interno == undefined ) throw new Error('Interno é obrigatório')

        const nomeFormatado = formatarNome(payload.nome);


        const exists = await this.ClienteGrupoRep.findOne({ 
            where: { 
               nome:nomeFormatado
            }
        });


        if(exists) throw new Error('Grupo de cliente já existe')
       
        
        return await this.ClienteGrupoRep.create({ ...payload, nome: nomeFormatado })
    }

    async update(id: number, payload: ClienteGrupoUpdateAttributes): Promise<[number]> {
        return await this.ClienteGrupoRep.updateById(id, payload)
    }
    
    async toggle(id: number): Promise<[number]> {
        return await this.ClienteGrupoRep.toggle(id)
    }

    async findByAviso(id: number): Promise<ClienteGrupo[] | ClienteGrupo>{
        return await this.ClienteGrupoRep.findAll({
            include: [
                {
                    association: 'familia',
                    required: true,
                    include: [
                        {
                            association: 'tags',
                            required: true,
                            include: [
                                {
                                    association: 'rankings',
                                    where: { aviso_id: id },
                                    required: true
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    }
}

export default new ClienteGrupoService();