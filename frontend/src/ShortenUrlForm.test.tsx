import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShortenUrlForm from './ShortenUrlForm';

describe('ShortenUrlForm', () => {
    it('renders input field', () => {
        render(<ShortenUrlForm onError={() => {}} onSuccess={() => {}} />);
        expect(screen.getByText('URL')).toBeDefined();
        expect(screen.getByText(/^Shorten$/i)).toBeDefined();
    });

    it('displays error message when submitting with empty input', async () => {
        const onErrorMock = jest.fn();
        render(<ShortenUrlForm onError={onErrorMock} onSuccess={() => {}} />);
        
        fireEvent.submit(screen.getByRole('button', { name: /Shorten/i }));

        await waitFor(() => {
            expect(onErrorMock).toHaveBeenCalledWith('Please enter a valid URL');
        });
    });

    it('calls onSuccess when submitting with a valid URL', async () => {
        const onSuccessMock = jest.fn();
        const validUrl = 'https://www.example.com';
        const response = { short_url: 'https://short.url' };
        window.fetch ||= jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(response),
            } as Response));
        jest.spyOn(window, 'fetch');
        
        render(<ShortenUrlForm onError={() => {}} onSuccess={onSuccessMock} />);
        fireEvent.change(screen.getByLabelText('URL'), { target: { value: validUrl } });
        fireEvent.submit(screen.getByRole('button', { name: /Shorten/i }));

        await waitFor(() => {
            expect(onSuccessMock).toHaveBeenCalledWith(response.short_url);
        });
    });

    it('displays error message when server response is not successful', async () => {
        const onErrorMock = jest.fn();
        const fetchMock = jest.spyOn(window, 'fetch');
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(Response),
        } as Response);
        

        render(<ShortenUrlForm onError={onErrorMock} onSuccess={() => {}} />);
        fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://www.example.com' } });
        fireEvent.submit(screen.getByRole('button', { name: /Shorten/i }));

        await waitFor(() => {
        expect(onErrorMock).toHaveBeenCalledWith('Something went wrong');
        });
    });

    it('displays error message when fetch fails', async () => {
        const onErrorMock = jest.fn();
        jest.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'));

        render(<ShortenUrlForm onError={onErrorMock} onSuccess={() => {}} />);
        fireEvent.change(screen.getByLabelText('URL'), { target: { value: 'https://www.example.com' } });
        fireEvent.submit(screen.getByRole('button', { name: /Shorten/i }));

        await waitFor(() => {
           expect(onErrorMock).toHaveBeenCalledWith('Something went wrong');
        });
    });
});
