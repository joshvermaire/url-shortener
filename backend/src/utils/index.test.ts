import { generateShortUrl, isValidUrl, SHORT_URL_LENGTH } from './index';

describe('generateShortUrl', () => {
    it('should generate a short URL with the correct length', () => {
        const shortUrl = generateShortUrl();
        expect(shortUrl).toHaveLength(SHORT_URL_LENGTH);
    });

    it('should generate a short URL with valid characters', () => {
        const shortUrl = generateShortUrl();
        const validCharacters = /^[A-Za-z0-9]+$/;
        expect(shortUrl).toMatch(validCharacters);
    });
});

describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true);
        expect(isValidUrl('http://subdomain.example.org/path')).toBe(true);
        expect(isValidUrl('subdomain.example.org/path')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
        expect(isValidUrl('invalid-url')).toBe(false);
    });
});
