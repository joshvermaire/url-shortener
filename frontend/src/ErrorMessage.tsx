import React from 'react';

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => {
    if (!message) return;
    return (
        <div style={{ color: '#f6481a' }}>
        {message}
        </div>
    );
}

export default ErrorMessage;