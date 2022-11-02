import { Routes, Route, useLocation } from 'react-router-dom'
import { Login } from './pages/login/login'
import { Dashboard } from './pages/dashboard/dashboard'
import styles from './router.module.scss'
import { ManageSubscriptions } from './pages/manage-subscriptions/manage-subscriptions'
import { Home } from './pages/home/home'
import { NewSubscription } from './pages/new-subscription/new-subscription'
import { LoginRedirect } from './components/login-redirect/login-redirect'

const routes = [
    {
        path: '/',
        element: Home
    },
    {
        path: '/log-in',
        element: Login
    },
    {
        path: '/dashboard',
        element: () => (
            <LoginRedirect>
                <Dashboard />
            </LoginRedirect>
        )
    },
    {
        path: '/dashboard/subscriptions',
        element: () => (
            <LoginRedirect>
                <ManageSubscriptions />
            </LoginRedirect>
        )
    },
    {
        path: '/dashboard/new',
        element: () => (
            <LoginRedirect>
                <NewSubscription />
            </LoginRedirect>
        )
    }
]

export const Router = () => {
    const location = useLocation()

    return (
        <div className={styles.container}>
            <Routes location={location}>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={<route.element/>} />
                ))}
            </Routes>
        </div>
    )
}