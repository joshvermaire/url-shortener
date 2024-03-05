import { useState, ChangeEvent, FormEvent } from 'react';
import './ShortenUrlForm.css';


interface Props {
  onError: (message: string) => void;
  onSuccess: (shortUrl: string) => void;
}

const ShortenUrlForm: React.FC<Props> = ({ onError, onSuccess }) => {
  const [longUrl, setLongUrl] = useState('');
  const [isDisabled, setDisabled] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLongUrl(event.target.value);
    onError('');
    setDisabled(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add logic to handle form submission (e.g., URL shortening)
    if (longUrl && !isDisabled) {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ long_url: longUrl }),
        };
  
        const res = await fetch('/api/create-short-url', requestOptions);
        const data = await res.json();

        if (data.short_url) {
          onSuccess(data.short_url);
          setDisabled(true);
        } else {
          onError('Something went wrong');
        }
      } catch (error) {
        console.error('Error:', error);
        onError('Something went wrong');
      }
    } else {
      onError('Please enter a valid URL');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="long_url">URL</label><br />
      <input
        type="text"
        id="long_url"
        name="long_url"
        placeholder="https://www.google.com"
        value={longUrl}
        onChange={handleInputChange}
        autoComplete="off"
      /><br />
      <input type="submit" value="Shorten" />
    </form>
  );
}

export default ShortenUrlForm;
