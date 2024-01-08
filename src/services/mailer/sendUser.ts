import { google } from "googleapis";
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
const env = process.env.NODE_ENV ?? 'dev';
    
dotenv.config({ path: `${env.toLowerCase()}.env` });
const OAuth2 = google.auth.OAuth2;

async function createTransporter() {

    const oauth2Client = new OAuth2(
       process.env.CLIENTID,
       process.env.CLIENTSECRET,
        "https://developers.google.com/oauthplayground"
    );


    oauth2Client.setCredentials({ refresh_token: process.env.REFRESHTOKEN });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err){
                console.log(err);
                reject(err);
            } 
            resolve(token);
        }
        )});

    if (!accessToken) throw new Error('Access Token not found');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAILUSER,
            clientId: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
            refreshToken: process.env.REFRESHTOKEN,
            accessToken: accessToken as string
        }
    });

    return transporter
}
const templates: { [key: string]: { subject: string; filename: string } } = {
    'reset-password': { subject: 'Redefinição de senha - Sistema Atlas', filename: 'reset-password.html' },
    'new-user': { subject: 'Seja bem vindo - Sistema Atlas', filename: 'new-user.html' },
    'update-password': { subject: 'Senha atualizada - Sistema Atlas', filename: 'update-password.html' },
    'week-refused': { subject: `Semana reaberta - Sistema Atlas`, filename: 'week-refused.html' }
}
async function getTemplates (scope:string, content: { [key: string]: string }): Promise<any> {
    try {
        const template = templates[scope];
        if (!template) throw new Error('Template não encontrado');

        let subject = template.subject;
        // const html = await ejs.renderFile(path.join(__dirname, '..', 'templates', template.filename), content);

        let html = fs.readFileSync(path.join(__dirname, 'templates', template.filename), 'utf8');

        const keys = Object.keys(content);

        for (const k of keys) {
            const regex = new RegExp(`\\[${k}\\]`, 'gi');
            html = html.replace(regex, content[k]);
        }

        if (scope == 'week-refused') subject = `Semana ${content.week} reaberta - Sieg Atividades`;

        return { subject, html };
    }
    catch (error) {
        console.log(error.message);
        return { subject: null, html: null };
    }
}

export default async function sendEmail(scope:string, mail:string, content: { [key: string]: string }){
    try {
        const transporter = await createTransporter();

        const { subject, html } = await getTemplates(scope, content);
        if (!subject || !html) throw new Error('Template não encontrado');

        const mailData = { from: process.env.MAILUSER, to: mail, subject, html }

        const email = await transporter.sendMail(mailData);
        if (!email || email.accepted.length == 0) throw new Error('Erro ao enviar email');

        return { success: true, message: 'Email enviado com sucesso' };
    }
    catch (error) {
        console.log(error.message);
        return { success: false, message: 'Erro ao enviar email' };
    }
}