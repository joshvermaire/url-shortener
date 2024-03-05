import { Pool, QueryResult } from 'pg';

const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
} = process.env;

export class DB {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: POSTGRES_USER,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DB,
            port: Number(POSTGRES_PORT),
            host: POSTGRES_HOST,
        });
    }

    async saveShortUrl(row: ShortUrlRow): Promise<boolean> {
        console.log(`[DB] Inserting new ${row.long_url} as: ${row.short_url}`);
        const client = await this.pool.connect();
        const result = await client.query<QueryResult<InsertResult>>(
            'INSERT INTO short_url_mappings (short_url, long_url) VALUES ($1, $2)',
            [row.short_url, row.long_url],
        );
        client.release();

        if (result && result.rowCount != null) {
            return result.rowCount > 0;
        }
        return false;
    }

    async fetchShortUrl(shortUrl: string): Promise<ShortUrlRow | null> {
        console.log(`[DB] Fetch short url ${shortUrl}`);
        const client = await this.pool.connect();
        const result = await client.query<ShortUrlRow>(
            'SELECT short_url, long_url FROM short_url_mappings WHERE short_url = $1',
            [shortUrl]
        );
        client.release();
            
        if (result.rows.length === 0) {
            return null;
        }
    
        return result.rows[0];
    }
}

export interface ShortUrlRow {
    long_url: string;
    short_url: string;
}

interface InsertResult {
    rowCount: number;
}