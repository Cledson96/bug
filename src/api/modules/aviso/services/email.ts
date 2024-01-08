import { AvisoEmailAttributes, AvisoEmailCreationAttributes } from 'atlasdb:types'
import { AvisoEmail } from 'atlasdb:models'
import { AvisoEmailRepository, AvisoRepository } from 'atlasdb:repositories'
import { FindOptions } from 'sequelize'
import mailer from '@service/mailer'
import moment from 'moment'
class AvisoEmailServices {
    private emailRep: AvisoEmailRepository
    private avisoRep: AvisoRepository

    constructor() {
        this.emailRep = new AvisoEmailRepository()
        this.avisoRep = new AvisoRepository()
    }

    async find(options?: FindOptions): Promise<AvisoEmail[]> {
        return await this.emailRep.findAll({
            include: [
                {
                    association: 'usuario',
                    attributes: ['nome', 'nick']
                }
            ]
        })
    }

    async findOne(options: FindOptions): Promise<AvisoEmail | null> {
        return await this.emailRep.findOne(options)
    }

    async create(payload: AvisoEmailCreationAttributes): Promise<AvisoEmail> {

        const create = await this.emailRep.create(payload)
        const send = await mailer.sendMail(payload)

        return send && create

    }

    async update(id: number, payload: AvisoEmailAttributes): Promise<[number]> {
        return await this.emailRep.updateById(id, payload)
    }

    async getTemplate(scope: string, aviso_id: number): Promise<string> {
        
        const getDayMoment = () => {
            const hour = parseInt(moment().format('HH'), 10)

            if (hour >= 0 && hour < 12) return 'bom dia'
            else if (hour >= 12 && hour < 18) return 'boa tarde'
            else if (hour >= 18 && hour < 24) return 'boa noite'
            else return ''
        }

        const email = await this.emailRep.findOne({
            where: { aviso_id: aviso_id },
        })
        const aviso = await this.avisoRep.findOne({
            where: { id: aviso_id }, 
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
        })

        const { origem_site, identificacao, data_encerramento, data_abertura, nome, objeto, unidade } = aviso.toJSON()

        const emailTemplate = mailer.getTemplate(scope, { 
            subject: '',
            content: {
                ARTIGO: "A Lei 8.666/1993 dispõe o seguinte: Art. 21. Os avisos contendo os resumos dos editais das concorrências, das tomadas de preços, dos concursos e dos leilões, embora realizados no local da repartição interessada, deverão ser publicados com antecedência, no mínimo, por uma vez: I - no Diário Oficial da União, quando se tratar de licitação feita por órgão ou entidade da Administração Pública Federal e, ainda, quando se tratar de obras financiadas parcial ou totalmente com recursos federais ou garantidas por instituições federais; II - no Diário Oficial do Estado, ou do Distrito Federal quando se tratar, respectivamente, de licitação feita por órgão ou entidade da Administração Pública Estadual ou Municipal, ou do Distrito Federal; III - em jornal diário de grande circulação no Estado e também, se houver, em jornal de circulação no Município ou na região onde será realizada a obra, prestado o serviço, fornecido, alienado ou alugado o bem, podendo ainda a Administração, conforme o vulto da licitação, utilizar-se de outros meios de divulgação para ampliar a área de competição. § 1º O aviso publicado conterá a indicação do local em que os interessados poderão ler e obter o texto integral do edital e todas as informações sobre a licitação. (GRIFO NOSSO) Bem como, a Lei nº 12.527/2011 traz em seu texto: Art. 8º. É dever dos órgãos e entidades públicas promover, independentemente de requerimentos, a divulgação em local de fácil acesso, no âmbito de suas competências, de informações de interesse coletivo ou geral por eles produzidas ou custodiadas. (...) § 1º Na divulgação das informações a que se refere o caput, deverão constar, no mínimo: (...) IV - informações concernentes a procedimentos licitatórios, inclusive os respectivos editais e resultados, bem como a todos os contratos celebrados. (GRIFO NOSSO)",
                EMPRESA: 'SIEG - APOIO ADMINISTRATIVO LTDA. M.E',
                EDITAL: identificacao!,
                DATA: String(moment(data_encerramento).format('DD/MM/YYYY')) || '',
                SAUDACAO: getDayMoment(),
                TELEFONE: '',
                EMAIL: '',
                TENTATIVA: '',
                ORGAO: String(unidade?.orgao?.nome),
                UF: String(unidade?.municipio?.uf),
                ABERTURA: String(moment(data_abertura).format('DD/MM/YYYY')) || '',
                OBJETO: objeto,
                URL: origem_site || '',
                PROCESSO: String(nome),
                ULTIMO_ENVIO: email ? moment(String(email.data_envio)).format('DD/MM/YYYY') : '<span style="color: red">NÃO EXISTE E-MAIL ENVIADO ANTERIORMENTE!</span>',
                SITE: origem_site || '' // TODO - Implementar links registrados
            }
        })

        if (!emailTemplate) throw new Error('Template não encontrado')

        return emailTemplate
    }

}

export default new AvisoEmailServices()
