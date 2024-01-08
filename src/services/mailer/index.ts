import { IMailer, MailerResponse } from "./interfaces/mailer";
const fs = require('fs');
import { IMailSource, IMailSourceOAuth2 } from "./interfaces/mailSource";
import { Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/json-transport';

import nodemailer from 'nodemailer';

import config from "@config";
import Mail from "nodemailer/lib/mailer";

import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;

import { promisify } from "util";
import { MailerOptions } from "./interfaces/mailer";
import { getTemplate as getTemplateData } from "./template";
import { getSignature } from "./signature";

class Mailer implements IMailer {
    public transporter?: Transporter;

    constructor() { }

    async setTransporter(): Promise<void> {
        
        const mailSource = config.mail;
    
        if (mailSource.type === 'SMTP') this.transporter = this.getStandardTransporter();

        this.transporter = await this.getOAuth2Transporter();
  
        this.verify();
    }

    private async getOAuth2Transporter(): Promise<Transporter<any>> {

        const mailConfig = config.mail as IMailSourceOAuth2;
      
        const oauth2Client = new OAuth2(
            mailConfig.auth.clientId,
            mailConfig.auth.clientSecret,
            "https://developers.google.com/oauthplayground"
        );
       
        oauth2Client.setCredentials({ refresh_token: mailConfig.auth.refreshToken });

        const getAccessToken = promisify(oauth2Client.getAccessToken).bind(oauth2Client);

        const accessTkn = await getAccessToken();

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err){
                    console.log(err);
                    reject(err);
                } 
                resolve(token);
            })
        });
 
        if (!accessToken) throw new Error('Access Token not found');
  
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: mailConfig.auth.user,
                clientId: mailConfig.auth.clientId,
                clientSecret: mailConfig.auth.clientSecret,
                refreshToken: mailConfig.auth.refreshToken,
                accessToken: accessToken as string
            }
        });
    }

    private getStandardTransporter(): Mail < any > {
        return nodemailer.createTransport(config.mail as IMailSource);
    }

    async sendMail(templateName: string, options: MailerOptions): Promise < MailerResponse > {
        //* Transporter

        await this.setTransporter();

        if(!this.transporter) throw new Error('Transporter not initialized');

        //* Template
        const template = getTemplateData(templateName, options);

        const signature = template.signature ? getSignature(template.signature) : getSignature('licitacao')
    
     

        const html = `${options.message ? options.message : template.html} ${signature.html}`;
        options.attachments = options.attachments ? [...options.attachments, signature] : [signature];
        //* Send

        const mail: SentMessageInfo = await this.transporter.sendMail({
            from: config.mail.auth.user,
            to: options.to,
            replyTo: options.replyTo,
            cc: options.cc,
            bcc: options.cco,
            html: html,
            subject: options.subject,
            attachments: options.attachments
        });

        let message = undefined;
        if (!mail) {
            message = 'O e-mail não foi enviado, tente novamente';
        }
        
        else if (mail.accepted.length === 0) {
            message = 'O e-mail não foi aceito pelos destinatários, realize o envio novamente';
        }
        else if (mail.rejected.length > 0) {
            message = `E-mail enviado, os seguintes destinatários não aceitaram: ${mail.rejected.join(', ')}`;
        }
      
        this.close();

        return { success: message === undefined, message };
    }

    async verify(): Promise<boolean> {
        if (!this.transporter) throw new Error('Serviço de e-mail não inicializado');
        return await this.transporter.verify();
    }

    close(): void {
        if (!this.transporter) throw new Error('Serviço de e-mail não inicializado');
        this.transporter.close();
    }

    getTemplate(scope: string, options: MailerOptions): string {
        const template = getTemplateData(scope, options);
        return template.html!;
    }
}

export default new Mailer();