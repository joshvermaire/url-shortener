export const SHORT_URL_LENGTH = 8;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateShortUrl = (): string => {
    let result = '';
    for (let i = 0; i < SHORT_URL_LENGTH; i++) {
        result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return result;
}

export const isValidUrl = (url: string): boolean => {
    const pattern = /((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/;
    return pattern.test(url);
}