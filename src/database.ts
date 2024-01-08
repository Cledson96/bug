import { Database } from 'atlasdb';
import config from "./config";

const Atlas: Database = new Database(config.database, {
        path: {
            logs: config.paths.logs,
        },
        env: config.env
    }
);

export { Atlas }