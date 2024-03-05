import { useState } from 'react'
import ShortenUrlForm from './ShortenUrlForm';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import './App.css'

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [shortUrl, setShortUrl] = useState('');


  const handleError = (message: string) => {
    setErrorMessage(message);
  }

  const handleSuccess = (shortUrl: string) => {
    setShortUrl(shortUrl);
  }

  return (
    <>
      <h1>URL Shortener</h1>
      <div className="prompt">
        <p>Enter the URL to shorten:</p>
        <ShortenUrlForm onError={handleError} onSuccess={handleSuccess} />
        <div className="messages">
          <ErrorMessage message={errorMessage} />
          <SuccessMessage shortUrl={shortUrl} />
        </div>
      </div>
    </>
  )
}

export default App;
