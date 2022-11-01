import { Navigate } from 'react-router-dom'
import { useDiscordStore } from "../../store/discordStore"

export const LoginRedirect = ({
    children
}) => {
    const user = useDiscordStore.getState()

    if (!user.loggedIn) {
        console.log("Redirecting to login...")
        return (
            <Navigate to="/" replace />
        )
    }

    return children
}