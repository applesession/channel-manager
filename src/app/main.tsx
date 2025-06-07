import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.scss';
import './styles/index.scss';
import App from '../pages/App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
