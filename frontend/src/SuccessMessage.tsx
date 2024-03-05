import React from 'react';

interface Props {
  shortUrl: string;
}

const SuccessMessage: React.FC<Props> = ({ shortUrl }) => {
    if (!shortUrl) return;
    const link = `https://short.ly/${shortUrl}`;
    const relativeLink = `/${shortUrl}`;

    const saveToClipboard =  async () => {
        try {
            await navigator.clipboard.writeText(link);
            console.log('Content copied to clipboard', link);
          } catch (err) {
            console.error('Failed to copy: ', err);
          }
    }
    

    return (
        <div className="success-message">
            <div style={{ color: '#4CAF50' }}>
            Success! Here's your short url:
            </div>
            <div className="display-short-url">
                <div><a href={relativeLink}>{link}</a></div>
                <div><button onClick={saveToClipboard} className="copy-short-url">Copy</button></div>
            </div>
        </div>
    );
}

export default SuccessMessage;