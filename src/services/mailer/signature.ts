import * as fs from "fs";
import { join } from "path";
import { MailerSignature } from "./interfaces/mailer";

export const templates: MailerSignature[] = [
    { name: 'licitacao', path: 'licitacao.jpg', filename: 'licitacao.jpg', cid: 'sig_licitacao' },
    { name: 'edital', path: 'edital.png', filename: 'edital.png', cid: 'sig_edital' },
    { name: 'dev', path: 'dev.jpg', filename: 'dev.jpg', cid: 'sig_dev' },
    { name: 'juridico', path: 'juridico.jpg', filename: 'juridico.jpg', cid: 'sig_juridico' },
];

const findSignature = (name: string): MailerSignature => {
    const signature = templates.find(t => t.name === name);

    if (!signature) throw new Error('Assinatura não encontrada');

    const path = join(__dirname, `./templates/signatures/${signature.filename}`);

  
    
    
    const hasFile = fs.existsSync(path);
 
  
    if (!hasFile) throw new Error('Template de assinatura não encontrado');

    signature.path = path;

    return signature;
}

export const getSignature = (name: string): MailerSignature => {
    const signature = findSignature(name);
    signature.html = `<img src="cid:${signature.cid}" width="472,33" height="197"/>`;
    return signature;
}