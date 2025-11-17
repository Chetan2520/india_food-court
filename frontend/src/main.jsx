
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
  <ScrollToTop/>
  <CartProvider> {/* Wrap here—now useCart works everywhere */}
      <App />
    </CartProvider>
    
    </BrowserRouter>
  </StrictMode>,
)
