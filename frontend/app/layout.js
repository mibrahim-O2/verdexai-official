import './globals.css';
import { ToastProvider } from './providers';
import { AuthProvider } from '../lib/authContext';

export const metadata = {
  title: 'VerdexAI - AI-Powered Hiring Solutions',
  description: 'Transform your recruitment process with VerdexAI - intelligent candidate screening, smart matching, and automated hiring workflows.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
