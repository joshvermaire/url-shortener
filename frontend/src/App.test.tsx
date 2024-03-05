import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import App from './App';

test('renders URL Shortener title', () => {
    render(<App />);
    const titleElement = screen.getByText(/URL Shortener/i);
    expect(titleElement).toBeInTheDocument();
});

test('shows correctly on load', () => {
    render(<App />);

    let errorMessage = 'Invalid URL';
    const errorMessageElement = screen.queryByText(errorMessage);
    expect(errorMessageElement).not.toBeInTheDocument();

    expect(screen.getByText(/Enter the URL to shorten:/i)).toBeInTheDocument()

    errorMessage = 'Please enter a valid URL';
    userEvent.click(screen.getByText(/^Shorten$/i));
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
});
