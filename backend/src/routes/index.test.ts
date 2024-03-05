import { Request, Response, NextFunction } from 'express';
import { Routes } from './index';
import { Pool } from 'pg';
import { DB } from '../db';

jest.mock('pg', () => {
    return {
        Pool: jest.fn(() => ({
            connect: jest.fn(),
            query: jest.fn(),
            release: jest.fn(),

        })),
    };
});

class MockDB extends DB {
    constructor() {
        super();
    }
    saveShortUrl = jest.fn().mockResolvedValue(true);
    fetchShortUrl = jest.fn().mockResolvedValue({ long_url: 'https://example.com' });
}

describe('Routes: validateRequestBody', () => {
    let routes: Routes;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

    beforeEach(() => {
        const mockDB = new MockDB();
        routes = new Routes(mockDB);
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should return 400 status with error message for missing parameters', () => {
        routes.validateRequestBody(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing parameters' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 status with error message for invalid URL', () => {
        req.body.long_url = 'invalid-url';
        routes.validateRequestBody(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid URL' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next middleware for valid parameters', () => {
        req.body.long_url = 'https://example.com';
        routes.validateRequestBody(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe('Routes: createShortUrl', () => {
    let routes: Routes;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        const mockDB = new MockDB();
        routes = new Routes(mockDB);
        req = { body: { long_url: 'https://example.com' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should generate and save a short URL', async () => {
        await routes.createShortUrl(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ long_url: 'https://example.com', short_url: expect.any(String) }));
    });

    it('should handle failure to generate short URL', async () => {
        const mockDB = new MockDB();
        mockDB.saveShortUrl = jest.fn().mockResolvedValue(false);
        routes = new Routes(mockDB);
        await routes.createShortUrl(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

  
describe('Routes: getShortUrl', () => {
    let routes: Routes;
    let req: Partial<Request>;
    let res: Partial<Response>;
  
    beforeEach(() => {
        const mockDB = new MockDB();
        routes = new Routes(mockDB);
        req = { params: { shortUrl: 'abcd1234' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            redirect: jest.fn(),
        };
    });
  
    it('should redirect to the long URL for a valid short URL', async () => {
        await routes.getShortUrl(req as Request, res as Response);
        expect(res.redirect).toHaveBeenCalledWith(302, 'https://example.com');
    });
  
    it('should return a 404 error for an invalid short URL', async () => {
        const mockDB = new MockDB();
        mockDB.fetchShortUrl = jest.fn().mockResolvedValue(null);
        routes = new Routes(mockDB);
        await routes.getShortUrl(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Short url not found' });
    });
  
    it('should handle database errors gracefully', async () => {
        const mockDB = new MockDB();
        mockDB.fetchShortUrl = jest.fn().mockRejectedValue(new Error('Database error'));
        routes = new Routes(mockDB);
        await routes.getShortUrl(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
  
