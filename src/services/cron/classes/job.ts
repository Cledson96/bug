import { ICronResponse } from '@service/cron/interfaces'
import * as cronjob from "node-cron";

export abstract class CronJob {
    private schedule: string;
    private task?: cronjob.ScheduledTask;
    private options: cronjob.ScheduleOptions = {
        scheduled: false
    }

    constructor(schedule: string) {
        this.schedule = schedule;
    }

    start(jobCallback: () => Promise<ICronResponse>) {
        const jobValid = cronjob.validate(this.schedule);
        if (jobValid) {
            this.task = cronjob.schedule(this.schedule, this.taskInitializer.bind(jobCallback), this.options);
            this.options.scheduled = true; // Mark as scheduled
            this.task!.start();
        }
    }

    stop() {
        if (this.task) {
            this.task.stop();
            this.options.scheduled = false; // Mark as unscheduled
        }
    }

    taskInitializer = async () => {
        const job: ICronResponse = await this.executeJob();
        if (job.success) {
            console.log("Job Successfully executed");
        } else {
            job.error = new Error("Error to execute the scheduled job");
        }
        
    }

    abstract executeJob(): Promise<ICronResponse>;

}
