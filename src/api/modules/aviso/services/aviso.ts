import { Aviso, AvisoItem, AvisoEmail, Abreviatura } from "atlasdb:models";
import { AvisoAttributes, AvisoCreationAttributes, AvisoMovimentacaoCreationAttributes, AvisoUpdateAttributes } from "atlasdb:types";
import { AvisoEmailRepository, AvisoItemRepository, AvisoMovimentacaoRepository, AvisoRepository } from "atlasdb:repositories";
import { FindOptions, Transaction } from "sequelize";
import { Atlas } from "@atlas";

class AvisoService {
    private avisoRep: AvisoRepository;
    private avisoMovimentacaoRep: AvisoMovimentacaoRepository;
    private avisoItemRep: AvisoItemRepository;
    private avisoEmailRep: AvisoEmailRepository;

    constructor() {
        this.avisoRep = new AvisoRepository();
        this.avisoMovimentacaoRep = new AvisoMovimentacaoRepository();
        this.avisoItemRep = new AvisoItemRepository();
        this.avisoEmailRep = new AvisoEmailRepository();
    }
    
    async getByScope(scope: string): Promise<Aviso[]> {
        const response = await this.avisoRep.scope(scope).findAll();
        
        return response;
    }

    async find(): Promise<Aviso[]> {
        return await this.avisoRep.findAll();
    }

    async findOne(options: FindOptions<AvisoAttributes>): Promise<Aviso | null> {
        if (!options.where) throw new Error('Where is required!');
        const data = await this.avisoRep.findOne(options)
        
        // data.edital = Abreviatura.normalizeModalidades(data.modalidade.nome) + Abreviatura.clearProcesso(data.identificacao);
        return data
    }

    async findEmails(id: number): Promise<AvisoEmail[]> {
        return await this.avisoEmailRep.findAll({
            where: { aviso_id: id }
        })
    }

    async create(payload: AvisoCreationAttributes | AvisoCreationAttributes[]): Promise<Aviso | Aviso[]> {
        if(Array.isArray(payload)) return await this.avisoRep.bulkCreate(payload);
        return await this.avisoRep.create(payload);
    }

    async update(id: number, payload: AvisoUpdateAttributes): Promise<[number]> {
        return await this.avisoRep.updateById(id, payload);
        
    }
    
    async handlePesquisaIA(id: number): Promise<void> {
        const t: Transaction = await Atlas.transaction();
        try {
            const movimentacao: AvisoMovimentacaoCreationAttributes = {
                aviso_id: id,
                data_inicio: new Date(),
                status_id: 8,
                usuario_id: 2, //? USUARIO IA
                justificativa: 'Movido por IA',
            }
            await this.avisoMovimentacaoRep.create(movimentacao, { transaction: t });
            
            await t.commit()
        } catch (error) {
            console.log(error);
            
            await t.rollback();
            throw new Error(error.message)
        }
    }
    
    async handlePreAnaliseIA(id: number): Promise<void> {
        const t: Transaction = await Atlas.transaction();
        try {
            const payload: AvisoUpdateAttributes = {
                analisado_preanalise: true                
            }
            
            await this.avisoRep.update(payload, { 
                where: { id }, 
                transaction: t
            });
            
            await t.commit()
        } catch (error) {
            console.log(error);
            
            await t.rollback();
            throw new Error(error.message)
        }
    }

    async findItens(id: number): Promise<AvisoItem[]> {
        return await this.avisoItemRep.findAll({
            where: {aviso_id: id}
        })
    }
}

export default new AvisoService();
