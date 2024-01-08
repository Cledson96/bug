import * as fs from "fs";
import { join } from "path";

import { MailerOptions, MailerTemplate } from "./interfaces/mailer";

export const templates: MailerTemplate[] = [
    { name: 'tarefas', subject: 'Tarefas pendentes no Atlas', filename: 'tarefas', params: true, signature: 'dev'},
    { name: 'notificacao', subject: 'Novas Notificações do Atlas', filename: 'notificacao', params: true, signature: 'dev'},
    { name: 'suspenso_eletronicos', subject: 'Solicitação de Informações - [ORGAO] - [PROCESSO]', filename: 'suspenso_eletronicos', params: true, signature: 'licitacao' },
    { name: 'suspenso_presenciais', subject: 'Solicitação de Informações - [ORGAO] - [PROCESSO]', filename: 'suspenso_presenciais', params: true, signature: 'licitacao' },
    { name: 'suspenso_solicitacao2', subject: 'Solicitação de Informações - [ORGAO] - [PROCESSO]', filename: 'suspenso_solicitacao2', params: true, signature: 'licitacao' },
    { name: 'suspenso_solicitacao3', subject: 'Solicitação de Informações - [ORGAO] - [PROCESSO]', filename: 'suspenso_solicitacao3', params: true, signature: 'licitacao' },
    { name: 'resgate_termo_ref1', subject: 'Solicitação do Termo de Referência - [ORGAO] - [EDITAL] - [PROCESSO]', filename: 'resgate_termo_ref1', params: true, signature: 'edital' },
    { name: 'resgate_termo_ref2', subject: 'Solicitação do Termo de Referência - [ORGAO] - [EDITAL] - [PROCESSO]', filename: 'resgate_termo_ref2', params: true, signature: 'edital' },
    { name: 'resgate_solicita_edital1', subject: 'Solicitação de Edital - [ORGAO] - [EDITAL]', filename: 'resgate_solicita_edital1', params: true, signature: 'edital' },
    { name: 'resgate_solicita_edital2', subject: 'Solicitação de Edital - [ORGAO] - [EDITAL]', filename: 'resgate_solicita_edital2', params: true, signature: 'edital' },
    { name: 'resgate_denuncia_email', subject: 'Denúncia - [ORGAO] - [EDITAL]', filename: 'resgate_denuncia_email', params: true, signature: 'edital' },
    { name: 'resgate_denuncia_semail', subject: 'Denúncia - [ORGAO] - [EDITAL]', filename: 'resgate_denuncia_semail', params: true, signature: 'edital' }, 
    { name: 'cadastro_usuario', subject: '', filename: 'cadastro_usuario', params: true, signature: 'dev' },               
    { name: 'nova_senha', subject: '', filename: 'nova_senha', params: true, signature: 'dev' },               
    { name: 'interesse_edital', subject: '', filename: 'interesse_edital', params: true, signature: 'dev' },               
];

const findTemplate = (name: string): MailerTemplate => {
    const template = templates.find(t => t.name === name);
    if (!template) throw new Error('Template não encontrado');
    
    const path = join(__dirname, `./templates/${template.filename}.html`);
    
    const hasFile = fs.existsSync(path);
    if (!hasFile) throw new Error('Template de e-mail não encontrado');

    const content = fs.readFileSync(path, 'utf8');
    template.html = content;

    return template;
}

export const getTemplate = (name: string, options: MailerOptions): MailerTemplate => {
    const template = findTemplate(name);

    if (!template.html) throw new Error('Template de e-mail não encontrado');
    if (!template.params) return template;


    if (!options.content) throw new Error('Conteúdo do e-mail não encontrado');

    let subject = template.subject;
    let html = template.html;

    const keys = Object.keys(options.content);

    for (const k of keys) {
        const regex = new RegExp(`\\[${k}\\]`, 'gi');
        html = html.replace(regex, options.content[k]);
        subject = subject.replace(regex, options.content[k]);
    }

    template.subject = subject;
    template.html = html;
    
    return template;
}