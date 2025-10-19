import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home/page.jsx'
import Doces from './pages/doces/page.jsx'
import Cart from './pages/cart/page.jsx'
import Profile from './pages/profile/page.jsx'
import Auth from './pages/auth/page.jsx'
import Receitas from './pages/receitas/page.jsx'

const pages = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children:[
      { path: '/', element: <Home /> },
      { path: '/doces', element: <Doces /> },
      { path: '/cart', element: <Cart /> },
      { path: '/profile', element: <Profile /> },
      { path: '/auth', element: <Auth /> },
      { path: '/receitas', element: <Receitas /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={pages} />
  </StrictMode>,
)
