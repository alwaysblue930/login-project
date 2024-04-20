import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './Root.tsx'
import Home from './features/home/pages/Home.tsx'
import ErrorFallback from './components/ErrorFallback.tsx'
import Login from './features/auth/pages/Login.tsx'
import SignUp from './features/user/pages/SignUp.tsx'
import VerifyUserId from './components/VerifyUserId.tsx'
import UserInfo from './features/user/pages/UserInfo.tsx'
import VerificationError from './features/auth/pages/VerificationError.tsx'
import VerificationSuccess from './features/auth/pages/VerificationSuccess.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/auth',
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'email/error',
            element: <VerificationError />,
          },
          {
            path: 'email/success',
            element: <VerificationSuccess />,
          },
        ],
      },
      {
        path: '/user',
        children: [
          {
            path: 'signup',
            element: <SignUp />,
          },
          {
            path: ':id',
            element: (
              <VerifyUserId>
                <UserInfo />
              </VerifyUserId>
            ),
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
