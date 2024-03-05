import { Request, Response, NextFunction } from 'express';
import { DB, ShortUrlRow } from '../db';
import { generateShortUrl, isValidUrl } from '../utils';

export class Routes {
    constructor(private db: DB) {}

    validateRequestBody(req: Request, res: Response, next: NextFunction) {
        const { long_url } = req.body;
        if (!long_url) {
            return res.status(400).json({ error: 'Missing parameters' });
        }
        if (!isValidUrl(long_url)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }
        next();
    }

    createShortUrl = async (req: Request, res: Response) => {
        const { long_url } = req.body;
        const row: ShortUrlRow = { long_url, short_url: '' };
        try {
            let success = false;
            let retries = 0;
            
            while (success === false && retries < 5) {
                row.short_url = generateShortUrl();
                success = await this.db.saveShortUrl(row);
                retries++;
            }
            
            if (success === false) {
                console.log('Unsuccessful short url generation');
                throw new Error('Failed to generate short url');
            }

            return res.status(200).json(row);
        } catch(error) {
            console.error('Unable to generate short url', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    getShortUrl = async (req: Request, res: Response) => {
        const shortUrl = req.params.shortUrl;
        try {
            const urlMapping = await this.db.fetchShortUrl(shortUrl);
            if (!urlMapping) {
                // Create 404 page
                return res.status(404).json({ error: 'Short url not found' });
            }
            res.redirect(302, urlMapping.long_url);
        } catch (error) {
            console.error('Error fetching short url:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}