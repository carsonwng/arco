import { ClickableTile } from "@carbon/react"
import { useEffect, useState } from "react"
import { Page, Title } from "../../components/layout/page"
import { HeaderTile, LoginTile } from "../../components/login-tile/login-tile"
import { useDiscordStore } from "../../store/discordStore"

import styles from './home.module.scss'

export const Home = () => {
    const user = useDiscordStore()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        if (user.loggedIn) {
            return setIsLoggedIn(true)
        }

        setIsLoggedIn(false)
    }, [user])

    return (
        <Page>
            <Title>
                Welcome!
                <br />
                {isLoggedIn ? (
                    "You're already logged in."
                ) : (
                    "Please log in to continue."
                )}
            </Title>

            <div className={styles.tile__container}>
                {isLoggedIn ? (
                    <HeaderTile
                        label={"Go to"}
                        title={"Dashboard"}
                        description={"Edit, manage, and view your subscriptions."}
                        buttonLabel={"Bring me there"}
                        href={"/dashboard"}
                        icon
                    />
                ) : (
                    <LoginTile />
                )}
            </div>
        </Page>
    )
}

