import { ParticipacaoArquivoCreationAttributes } from 'atlas-orm/build/schemas/interfaces'
import { ParticipacaoArquivo } from 'atlasdb:models'
import  { ParticipacaoArquivoRepository } from 'atlasdb:repositories'
import { FindOptions } from 'sequelize'
import AWS from 'aws-sdk'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

const credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
})

AWS.config.update({
    credentials: credentials,
    region: process.env.AWS_REGION,
})

interface FileObject {
    key: string,
    name: string,
    dateModified: Date,
    isDirectory: boolean,
    size: number
    hasSubDirectories: boolean,
}

class ParticipacaoArquivoService {
    public ParticipacaoArquivoRep: ParticipacaoArquivoRepository

    constructor() {
        this.ParticipacaoArquivoRep = new ParticipacaoArquivoRepository()

    }

    async find(options?: FindOptions): Promise<[FileObject[]]> {
        const s3 = new AWS.S3()
        const accessKeyId = AWS.config.credentials?.accessKeyId;
        const secretAccessKey = AWS.config.credentials?.secretAccessKey;
        const region = AWS.config.region;
        const bucket = process.env.AWS_BUCKET ?? ''
        const prefix = 'ESTADO DO PARANA/'

        console.log('Carregando arquivos...');
        

        const params: AWS.S3.ListObjectsV2Request = {
            Bucket: bucket,
            Prefix: prefix,
        }

        return new Promise<[FileObject[]]>((resolve, reject) => {
            s3.listObjectsV2(params, (error: any, data: AWS.S3.ListObjectsV2Output) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    if(data.Contents) {
                    const arquivos = data.Contents.map((obj: AWS.S3.Object) => {
                        const response: FileObject = {
                            key: obj.Key || '',
                            name: obj.Key || '',
                            dateModified: obj.LastModified || new Date(),
                            isDirectory: false,
                            size: obj.Size || 0,
                            hasSubDirectories: false,
                        }

                        return response
                            // url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`
                    })
                    // resolve([this.ParticipacaoArquivoRep.findAll(options), arquivos])
                    resolve([arquivos])
                    } else {
                        console.log('Nenhum conteúdo encontrado no Amazon S3.');
                        resolve([[]])
                    }
                    
                }
            })
        })
        
    }

    async findOne(options: FindOptions): Promise<ParticipacaoArquivo> {
        if (!options.where) throw new Error('Where is required!')
        return await this.ParticipacaoArquivoRep.findOne(options)
    }

    async create(payload: ParticipacaoArquivoCreationAttributes): Promise<ParticipacaoArquivo> {
         // ------------- upload para a pasta A ------------- //
        const uploadFolder = 'Aviso'
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `A:\\Temp\\Mateus\\${uploadFolder}`)
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        })
        const upload = multer({ storage: storage})

        // ------------- upload para AWS ------------- //
      
        const s3 = new AWS.S3()
        const bucket = process.env.AWS_BUCKET ?? ''
        
        const params: AWS.S3.PutObjectRequest = {
            Bucket: bucket,
            Key: 'teste.txt',
            Body: 'teste',
        }
        
        const uploaded = await s3.upload(params).promise()

        return await this.ParticipacaoArquivoRep.create(payload)
    }
}

export default new ParticipacaoArquivoService()