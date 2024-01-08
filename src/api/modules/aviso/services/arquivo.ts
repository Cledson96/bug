import { AvisoArquivoAttributes, AvisoArquivoCreationAttributes, AvisoArquivoUpdateAttributes, FileManagerAttributes } from "atlasdb:types";
import { AvisoArquivo } from "atlasdb:models";
import { AvisoArquivoRepository } from "atlasdb:repositories";
import { FindOptions } from "sequelize";
import fs from 'fs'
import AWS from 'aws-sdk'
import multer from 'multer'
import dotenv from 'dotenv'
import mime from 'mime'


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
class AvisoArquivoService {
    private avisoArquivoRep: AvisoArquivoRepository;
    constructor() {
        this.avisoArquivoRep = new AvisoArquivoRepository()
    }

    // async getAWSFiles(): Promise<FileManagerAttributes[] | null> {
    //     try {
    //         const s3 = new AWS.S3()
    //         const bucket = process.env.AWS_BUCKET ?? ''
    //         // const prefix = '2023/'
    //         const params: AWS.S3.ListObjectsV2Request = {
    //             // Prefix: prefix,
    //             Bucket: bucket,
    //         };

    //         const data: AWS.S3.ListObjectsV2Output = await new Promise((resolve, reject) => {
    //             s3.listObjectsV2(params, (error: any, result: AWS.S3.ListObjectsV2Output) => {
    //                 if (error) {
    //                     console.log(error)
    //                     reject(error)
    //                 } else {
    //                     resolve(result)
    //                 }
    //             })
    //         })

    //         if (data.Contents) {
    //             const directory: FileManagerAttributes[] = data.Contents.map((obj: AWS.S3.Object) => {
    //                 const isDirectory = obj.Key ? !obj.Key.includes('.') : true;

    //                 const avisoArquivo: FileManagerAttributes = {
    //                     name: obj.Key || '',
    //                     isDirectory: isDirectory,
    //                     dateModified: obj.LastModified,
    //                     url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`,
    //                     size: obj.Size
    //                 };

    //                 return avisoArquivo
    //             });

    //             return directory;
    //         } else {
    //             console.log('Nenhum conteúdo encontrado no Amazon S3.');
    //             return null
    //         }
    //     } catch (error) {
    //         console.error('Ocorreu um erro ao obter arquivos da AWS:', error);
    //         return null
    //     }
    // }
    async getLocalFiles(path: string): Promise<FileManagerAttributes[]> {
        try {
            const directory: FileManagerAttributes[] = [];
            const defaultPath = 'C:/Avisos';
            const files = fs.readdirSync(`${defaultPath}/${path}`);

            if (!files) return directory;

            for (let f of files) {
                const stats = fs.lstatSync(`${defaultPath}/${path}/${f}`);
    
                const isDirectory = stats.isDirectory();
    
                if (isDirectory) {
                    const subItems = await this.getLocalFiles(`${path}/${f}`);
                    directory.push({
                        name: f,
                        isDirectory: true,
                        dateModified: String(stats.atime),
                        url: fs.realpathSync(`${defaultPath}/${path}/${f}`),
                        items: subItems,
                    });
                } else {
                    directory.push({
                        name: f,
                        isDirectory: false,
                        dateModified: String(stats.atime),
                        path: fs.realpathSync(`${defaultPath}/${path}/${f}`),
                        size: stats.size,
                    });
                }
            }
    
            return directory;
        } catch (error) {
            console.error('Ocorreu um erro ao obter arquivos locais:', error);
            return [];
        }
    }
    
    async getDirectoryContents(path: string): Promise<{ awsFiles: FileManagerAttributes[] | null, localFiles: FileManagerAttributes[] | null }> {
        try {
            // const awsFilesFunction = this.getAWSFiles();
            const localFilesFunction = this.getLocalFiles(path); 
            
            // const [awsFiles, localFiles] = await Promise.all([awsFilesFunction, localFilesFunction]);
            const [localFiles] = await Promise.all([localFilesFunction]);
            const awsFiles: any = []

            // return { awsFiles: awsFiles, localFiles: localFiles };

            return { awsFiles: awsFiles, localFiles: localFiles };
            
        } catch (error) {
            console.error('Ocorreu um erro ao obter conteúdos:', error);
            return { awsFiles: null, localFiles: null };
        }
    }

    async getFile(path: string): Promise<FileManagerAttributes[] | Object | null>{
        const stats = fs.lstatSync(path)
        const buffer = fs.readFileSync(path)

        const getFileExtension = (filename: string) => {
            return filename.split('.').pop();
        }

        return {
            name: path.split('\\').pop(),
            dateModified: stats.mtime,
            extension: getFileExtension(path),
            path: path,
            mime: mime.getType(path),
            buffer: buffer,
            size: stats.size
        }
    }

    async moveFile(item: FileManagerAttributes, destinationDir: FileManagerAttributes){
        const defaultPath = 'C:/Avisos'
        const oldPath = `${defaultPath}/${item.path}`;
        const newPath = `${defaultPath}/${destinationDir.path}/${item.name}`;

        if(fs.existsSync(newPath)) throw new Error('Arquivo já existe')

        fs.renameSync(oldPath, newPath)

    } 

    async copyFile(item: FileManagerAttributes, destinationDir: FileManagerAttributes){
        const defaultPath = 'C:/Avisos'
        const oldPath = `${defaultPath}/${item.path}`
        const newPath = `${defaultPath}/${destinationDir.path}/${item.name}`

        if(fs.existsSync(newPath)) throw new Error ('Arquivo já existe')
        if(item.isDirectory) throw new Error("Não é possivel criar diretórios");
        
        fs.copyFileSync(oldPath, newPath)

    }

    async deleteFile(item: FileManagerAttributes,){
        const defaultPath = 'C:/Avisos'
        const oldPath = `${defaultPath}/${item.path}`

        if(!fs.existsSync(oldPath)) throw new Error("Arquivo não existe");
        if(item.isDirectory) {
            if(fs.readdirSync(oldPath).length > 0) throw new Error("Diretório não está vazio");
            fs.rmdirSync(oldPath)
        }
        else fs.unlinkSync(oldPath)        
    }

    async renameFile(item: FileManagerAttributes, newName: string) {
        const defaultPath = 'C:/Avisos';
        const oldPath = `${defaultPath}/${item.path}`;
        const newPath = `${defaultPath}/${item.parentPath}/${newName}`;
    
        if (fs.existsSync(newPath)) throw new Error('Arquivo já existe');
    
        if (item.isDirectory) throw new Error('Renomear diretórios não é permitido');
    
        fs.renameSync(oldPath, newPath);
    }

    async createDirectory(parentDir: FileManagerAttributes, name: FileManagerAttributes){
        const defaultPath = 'C:/Avisos'
        const newPath = `${defaultPath}/${parentDir.path}/${name}`
    
        if(fs.existsSync(newPath)) throw new Error("Arquivo já existe");
        
        fs.mkdirSync(newPath)

    }

    async uploadFiles(files: FileManagerAttributes, destinationDir: string) {
        const destination = JSON.parse(destinationDir)
        const defaultPath = 'C:/Avisos'
        const tempFiles = Object.values(files)

        for(let file of tempFiles){
            const filePath = `${defaultPath}/${destination.path}/${file.name}`
            fs.writeFileSync(filePath, file.data)
        }

    }

    async findOne(options: FindOptions): Promise<AvisoArquivo | null> {
        if (!options.where) throw new Error('Where is required!');
        return await this.avisoArquivoRep.findOne(options);
    }

    async create(payload: AvisoArquivoCreationAttributes | AvisoArquivoCreationAttributes[]): Promise<AvisoArquivo | AvisoArquivo[]> {
        if(Array.isArray(payload)) return await this.avisoArquivoRep.bulkCreate(payload);
        return await this.avisoArquivoRep.create(payload);
    }

    async update(id: number, payload: AvisoArquivoUpdateAttributes): Promise<[number]> {
        return await this.avisoArquivoRep.updateById(id, payload);
    }
}

export default new AvisoArquivoService();