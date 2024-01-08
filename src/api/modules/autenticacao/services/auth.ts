import jwt from 'jsonwebtoken';
import crypt from '@service/crypt';
import { Request } from 'express';

import { Usuario , Setor} from 'atlasdb:models';
import { UsuarioRepository } from 'atlasdb:repositories';

import {UsuarioUpdateAttributes } from 'atlasdb:types';
import mailer from '@service/mailer/index';
import { randomCode } from '@util/generator';

class AuthService {
    private usuarioRep: UsuarioRepository;

    constructor() {
        this.usuarioRep = new UsuarioRepository();
    }

    async authenticateUser(nick: string, senha: string): Promise<string> {
      
        try{
            const usuario = await this.usuarioRep.findOne({ where: { nick: nick ,ativo:true} });
    
            if (!usuario) throw new Error('Usuário não encontrado!');
            
          
           if (!crypt.compare(senha, usuario.senha)) throw new Error('Senha incorreta!');
    
            const token = jwt.sign({ id: usuario.id, nick: usuario.nick }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
            return token;
        }catch(error){
            throw new Error(error);
        }
        
    }

    async getUser(req : Request): Promise<Usuario | null> {
        try{
            const token : string | string[] | undefined = req.headers['authorization'] || req.headers['x-access-token']
    
            if (!token) throw new Error('Token não informado!');
    
            if (typeof token !== 'string') throw new Error('Token inválido!');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
            if (typeof decoded === 'string') throw new Error('Token inválido!');
            const usuario = await this.usuarioRep.findById(decoded.id,{attributes: { exclude: ['senha']},
            include:[{model: Setor,  through: {attributes: []} },{association:'tipo'}]});
    
            if (!usuario) throw new Error('Usuário não encontrado!');
    
            return usuario;
        }catch(error){
            throw new Error(error);
        }

    }

    async changePassword(req: Request): Promise<Usuario | null> {
        try{
            const usuario = await this.getUser(req);

            if (!usuario) throw new Error('Usuário não encontrado!');
    
            const payload: UsuarioUpdateAttributes & {senhaAntiga:string}= {
                ...req.body
            }
    
            if (typeof payload.senha !== 'string') throw new Error('Senha inválida!');
    
            payload.senha = crypt.encrypt(payload.senha);
         

            if (!crypt.compare(payload.senhaAntiga?? '', usuario.senha)) throw new Error('Senha incorreta!');

            await this.usuarioRep.updateById(usuario.id, payload);
    
            const updatedUser = await this.usuarioRep.findById(usuario.id,{attributes: { exclude: ['senha']},
            include:[{model: Setor,  through: {attributes: []} }]});
    
            return updatedUser;

        }catch(error){
            throw new Error(error);  
        }
        
    }
    async resetPassword(email: string): Promise<string | object> {
        try{
            const user = await this.usuarioRep.findOne({ where: { email: email } });

          
            if (!user) throw new Error('Usuário não encontrado!');
            const codigo = randomCode(6);

            await this.usuarioRep.updateById(user.id, {codigo:codigo});

            const sendEmail = await mailer.sendMail('nova_senha',
            {to:email,content:{codigo,nick:user.nick},subject:'Criar nova senha' }
            );
       
            
           if (!sendEmail.success) throw new Error('Erro ao enviar e-mail');  
    
         
           
    
            return {success:true,message:'Código enviado com sucesso!',codigo:codigo};
        }catch(error){
            throw new Error(error);
        }
        
    }
    async newPassword(email: string , codigo:string , senha:string): Promise<string | object> {
        try{
            const user = await this.usuarioRep.findOne({ where: { email: email , codigo:codigo } });
          
            if (!user) throw new Error('Usuário não encontrado!');
            
            const newSenha =crypt.encrypt(senha);

            await this.usuarioRep.updateById(user.id, {codigo:undefined,senha:newSenha});
    
            return {success:true,message:'Senha alterada com sucesso!'};
        }catch(error){
            throw new Error(error);
        }
        
    }

}

export default new AuthService();