import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ChatProvider from './context/chatProvider';
import {BrowserRouter} from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <ChatProvider>
  <ChakraProvider>
        <App />
  </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>,
);


