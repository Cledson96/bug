import { AvisoMovimentacaoCreationAttributes } from "atlasdb:types";
import { AvisoMovimentacao } from "atlasdb:models";
import { AvisoMovimentacaoRepository, AvisoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";
import { Op } from "sequelize";
import axios from "axios";
import config from "@config";
import { Transaction } from "sequelize";
import { Atlas } from "@atlas";

class AvisoMovimentacaoService {
    private avisoRep: AvisoRepository;
    private avisoMovimentacaoRep: AvisoMovimentacaoRepository;
    constructor() {
        this.avisoRep = new AvisoRepository();
        this.avisoMovimentacaoRep = new AvisoMovimentacaoRepository()        ;
    }

    async find(id: number): Promise<AvisoMovimentacao[]> {
        return await this.avisoMovimentacaoRep.findAll({
            where: { aviso_id: id },
            include: [
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                },
                {
                    association: 'status',
                    attributes: ['nome']
                }
            ],
            order: ['created_at']
        });
    }

    async findAll(usuario_id: any, date_start: Date, date_end: Date): Promise<AvisoMovimentacao[]> {
        const where: any =  {
            data_inicio: {
                [Op.gte]: date_start + ' 00:00:00',
                [Op.lte]: date_end + ' 23:59:59.999999',
            }
        }

        if(usuario_id !== null && usuario_id.length > 0){
            where.usuario_id = usuario_id
        }

        return await this.avisoMovimentacaoRep.findAll({
            where,
            include: [
                {
                    association: 'aviso',
                    attributes: ['nome', 'identificacao', 'processo', 'objeto']
                },
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                },
                {
                    association: 'status',
                    attributes: ['nome']
                }
            ],
            order: ['data_inicio']
        });

    }

    async findOne(options: FindOptions): Promise<AvisoMovimentacao | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.avisoMovimentacaoRep.findOne(options);
    }

    async create(payload: AvisoMovimentacaoCreationAttributes | AvisoMovimentacaoCreationAttributes[]): Promise<AvisoMovimentacao | AvisoMovimentacao[]> {
        if (Array.isArray(payload)) return await this.avisoMovimentacaoRep.bulkCreate(payload);
        return await this.avisoMovimentacaoRep.create(payload);
    }

    async update(id: number, payload: AvisoMovimentacaoCreationAttributes): Promise<AvisoMovimentacao | undefined> {
        const t: Transaction = await Atlas.transaction()
        try {
            const movimentacao = await this.avisoMovimentacaoRep.create({
                aviso_id: id,
                ...payload
            }, { transaction: t });
            await t.commit();


            if(movimentacao.status_id == 9) {
                const aviso = await this.avisoRep.findOne({
                    where: { id },
                    include: [
                        { association: 'arquivos', include: ['tipo_arquivo']},
                    ],
                })

                if(!aviso) throw new Error('Aviso não encontrado');

                const analise_payload = {
                    id: aviso.id,
                    caminhos_arquivos: aviso.arquivos.map(arq => (`triagem/${aviso.nome}/${arq.nome}.${arq.tipo_arquivo?.extensao}`)),
                    grupos: []
                }

                // const { data } = await axios.post('http://192.168.1.95:7700/api/analise-ia/preanalise/atlas', analise_payload)

                // console.log(data.message);
            }
            
            return movimentacao;
        } catch (error) {
            console.log(error.message);
            throw new Error(error)
            
        }
    }
}

export default new AvisoMovimentacaoService();