import { UsuarioRepository,UsuarioSetorRepository } from 'atlasdb:repositories';
import { Usuario, Setor, Tipo } from 'atlasdb:models';
import crypt from '@service/crypt';
import { UsuarioCreationAttributes, UsuarioUpdateAttributes } from 'atlasdb:types';
import { FindOptions } from 'sequelize';
import { randomCode } from '@util/generator';
import mailer from '@service/mailer/index';

class UsuarioService {
    private usuarioRep: UsuarioRepository;
    private setoresRep: UsuarioSetorRepository;

    constructor() {
        this.usuarioRep = new UsuarioRepository();
        this.setoresRep = new UsuarioSetorRepository();
    }

    async find(options?: FindOptions): Promise<Usuario[]> {
        return await this.usuarioRep.findAll({attributes: { exclude: ['senha']},
    include:[{model: Setor,  through: {attributes: []} },{association:'tipo'}]});
    }

    async findOne(options: FindOptions ): Promise<Usuario | null> {
        if (!options.where) throw new Error('Where is required!');

        return await this.usuarioRep.findOne(options);
    }

    async findById(id: number): Promise<Usuario | null> {
        return await this.usuarioRep.findById(id);
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        return await this.usuarioRep.findOne({ where: { email } });
    }

    async create(data: UsuarioCreationAttributes): Promise<Usuario> {

        const password = randomCode(8);
        const senha =crypt.encrypt(password);

        const email = await mailer.sendMail('cadastro_usuario',
        {to:data.email,content:{nick: data.nick, senha:password},subject:'Cadastro de Usuário' });
        if (!email.success) throw new Error('Erro ao enviar e-mail');  
            
        const usuario = await this.usuarioRep.create({...data, senha});

        data.setores?.map(async (setor)=>{await this.setoresRep.create({usuario_id:usuario.id,setor_id:Number(setor)});})
  
        return usuario;
    }

    async update(id: number, data: UsuarioUpdateAttributes): Promise<[number]> {
     
        const userUpdated= await this.usuarioRep.updateById(id, data);
        await this.setoresRep.delete({where:{usuario_id:id}});
        
        data.setores?.map(async (setor)=>{await this.setoresRep.create({usuario_id:id,setor_id:Number(setor)});})
        return userUpdated
    }

    // async confirmAccount(id: number): Promise<[number]> {
    //     return await this.usuarioRep.confirmAccount(id);
    // }

    // async delete(id: number): Promise<[number]> {
    //     return await this.usuarioRep.updateById(id, { ativo: false });
    // }
}

export default new UsuarioService();