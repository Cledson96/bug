import { SendMailOptions } from 'nodemailer';
import { Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/json-transport';
import { Attachment } from 'nodemailer/lib/mailer';

export interface IMailer {
    transporter?: Transporter;
    sendMail(templateName: string, options: SendMailOptions): Promise<any>;
    verify(): Promise<boolean>;
    close(): void;
}

export interface MailerOptions {
    subject: string;
    to: string;
    cc?: string;
    cco?: string;
    replyTo?: string;
    message?: string;
    attachments?: Attachment[];
    content?: MailerTemplateContent;
}

export interface MailerTemplate {
    name: string;
    subject: string;
    filename: string;
    params?: boolean;
    html?: string;
    signature?: string;
}

export interface MailerSignature {
    name: string;
    path: string;
    filename?: string;
    cid?: string
    html?: string;
}

export interface MailerTemplateContent {
    [key: string]: any;
}

export interface MailerResponse {
    success: boolean;
    message?: string;
}