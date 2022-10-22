import { Routes, Route, useLocation } from 'react-router-dom'
import { Login } from './pages/login/login'
import { Dashboard } from './pages/dashboard/dashboard'
import styles from './router.module.scss'

const routes = [
    {
        path: '/',
        element: () => (
            <div>Home</div>
        )
    },
    {
        path: '/log-in',
        element: Login
    },
    {
        path: '/dashboard',
        element: Dashboard
    }
]

export const Router = () => {
    const location = useLocation()

    return (
        <div className={styles.container}>
            <Routes locatrion={location}>
                {/* <Route path="*" element={<div>asdpisaj</div>} /> */}
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={<route.element/>} />
                ))}
            </Routes>
        </div>
    )
}