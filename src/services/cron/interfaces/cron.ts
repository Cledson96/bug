import { CronJob } from "@service/cron/classes";

export interface ICronResponse {
    success: boolean;
    error?: Error;
}

export interface ICronModule {
    name: string;
    cron: CronJob;
}