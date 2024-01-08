import { ParticipacaoEmailAttributes, ParticipacaoEmailCreationAttributes } from 'atlasdb:types'
import { ParticipacaoEmail } from 'atlasdb:models'
import { ParticipacaoEmailRepository, ParticipacaoRepository } from 'atlasdb:repositories'
import { FindOptions } from 'sequelize'
import mailer from '@service/mailer'
import moment from 'moment'
class ParticipacaoEmailServices {
    private emailRep: ParticipacaoEmailRepository
    private participacaoRep: ParticipacaoRepository

    constructor() {
        this.emailRep = new ParticipacaoEmailRepository()
        this.participacaoRep = new ParticipacaoRepository()
    }

    async find(options?: FindOptions): Promise<ParticipacaoEmail[]> {
        return await this.emailRep.findAll({
            include: [
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                }
            ]
        })
    }

    async findOne(options: FindOptions): Promise<ParticipacaoEmail | null> {
        return await this.emailRep.findOne(options)
    }

    async create(payload: ParticipacaoEmailCreationAttributes): Promise<ParticipacaoEmail> {

        const create = await this.emailRep.create(payload)
        const send = await mailer.sendMail(payload)

        return send && create

    }

    async update(id: number, payload: ParticipacaoEmailAttributes): Promise<[number]> {
        return await this.emailRep.updateById(id, payload)
    }

    async getTemplate(scope: string, participacao_id: number): Promise<string> {

        const getDayMoment = () => {
            const hour = parseInt(moment().format('HH'), 10)

            if (hour >= 0 && hour < 12) return 'bom dia'
            else if (hour >= 12 && hour < 18) return 'boa tarde'
            else if (hour >= 18 && hour < 24) return 'boa noite'
            else return ''
        }

        const email = await this.emailRep.findOne({
            where: { participacao_id: participacao_id },
        })
        const participacao = await this.participacaoRep.findOne({
            where: { id: participacao_id }, include: [
                {
                    association: 'aviso',
                    attributes: ['nome', 'processo'],
                    include: [
                        {
                            association: 'unidade',
                            attributes: ['orgao_id'],
                            include: [
                                {
                                    association: 'orgao',
                                    attributes: ['nome'],
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        const { aviso, objeto } = participacao.toJSON()

        const emailTemplate = await mailer.templates(scope, {
            SAUDACAO: getDayMoment(),
            ORGAO: String(aviso?.unidade?.orgao?.nome),
            OBJETO: objeto,
            PROCESSO: String(aviso?.processo),
            ULTIMO_ENVIO: email ? moment(String(email.data_envio)).format('DD/MM/YYYY') : '<span style="color: red">NÃO EXISTE E-MAIL ENVIADO ANTERIORMENTE!</span>',
            LINKS_REGISTRADOS: 'google.com.br', // TODO - Implementar links registrados
        })


        if (!emailTemplate) throw new Error('Email não encontrado')

        return emailTemplate
    }

}

export default new ParticipacaoEmailServices()
