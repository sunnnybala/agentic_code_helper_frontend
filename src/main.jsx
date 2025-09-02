import React from 'react'
import ReactDOM from 'react-dom/client'
import AppShell from './AppShell'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
