import { CronJob } from "./classes/job";
import { ICronModule } from "./interfaces";

export class Cron {
    private static cronJobs: Map<string, CronJob> = new Map();

    static start(job: ICronModule) {

        job.cron.start(job.cron.executeJob.bind(job.cron));
        Cron.cronJobs.set(job.name, job.cron);
        
        console.log(`Cron ${job.name} initialized.`);
    }

    static stop(name: string) {
        const cronJob = Cron.cronJobs.get(name);

        if (cronJob) {
            cronJob.stop();
            Cron.cronJobs.delete(name);
            console.log(`Cron ${name} stopped.`);
        } 
        else {
            console.log(`Cron ${name} not found.`);
        }
    }

    static stopAll() {
        for (const [name, cronJob] of Cron.cronJobs.entries()) {
            cronJob.stop();
            console.log(`Cron ${name} stopped.`);
        }
        Cron.cronJobs.clear();
    }
}