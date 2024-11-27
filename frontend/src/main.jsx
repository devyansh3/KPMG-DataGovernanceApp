import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import adminStore from './store/adminStore.js';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <Provider store={adminStore}>
    <App />
  </Provider>
);
