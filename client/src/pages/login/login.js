import { useEffect, useState } from "react"
import { useHref, useLocation, useSearchParams } from "react-router-dom"
import axios from "axios"
import { useDiscordStore } from "../../store/discordStore"
import { ProgressBar, ProgressIndicator, ProgressStep } from "@carbon/react"
import { Page, Title } from "../../components/layout/page"

import styles from "./login.module.scss"


export const Login = () => {
    const user = useDiscordStore()
    const location = useLocation()

    const [message, setMessage] = useState("")
    const [errored, setErrored] = useState(false)
    const [completed, setCompleted] = useState(false)
    
    useEffect(() => {
        if (user.loggedIn) {
            setMessage("Already logged in!")
            return setCompleted(true)
        }

        getUser()
    }, [])

    useEffect(() => {
        if (!completed) return

        
    }, [completed])

    const getUser = async () => {
        setMessage("Checking with Discord")

        try {
            const userObj = {}

            const clean = location.hash.slice(1, location.hash.length).split("&").reduce((_, cur) => {
                const [key, value] = cur.split("=")
                return userObj[key] = value 
            })
    
            const res = await axios.get(`https://discord.com/api/users/@me`, {
                headers: {
                    Authorization: `Bearer ${userObj.access_token}`
                }
            })
    
            const expiry = await axios.get(`https://discord.com/api/oauth2/@me`, {
                headers: {
                    Authorization: `Bearer ${userObj.access_token}`
                }
            })
    
            setMessage("Cleaning up")
            
            user.setState({
                loggedIn: true,
                user: {
                    access_token: userObj.access_token,
                    expires_at: expiry.data.expires,
                    scope: userObj.scope,
    
                    id: res.data.id,
                    username: res.data.username + "#" + res.data.discriminator,
                    avatar: res.data.avatar,
                    banner: res.data.banner,
                    accent_color: res.data.accent_color
                }
            })
    
            setMessage("Done!")
            setCompleted(true)
        } catch (err) {
            setMessage(err.message)
            setErrored(true)
        }
    }

    return (
        <Page>
            <Title>
                {!errored && !completed && (
                    <>
                        We're Currently
                        <br />
                        Checking Your
                        <br />
                        Information.
                    </>
                )}

                {errored && (
                    <>
                        Uh Oh :(                 
                        <br />
                        If You're Seeing This,
                        <br />
                        Something Went Wrong.
                    </>
                )}

                {completed && (
                    <>
                        Success :)
                        <br />
                        Bringing You
                        <br />
                        Somewhere Cool.
                    </>
                )}
            </Title>

            <div className={styles.progress__container}>
                <ProgressBar
                    label=""
                    helperText={
                        message
                    }
                    hideLabel
                    status={(user.loggedIn && "finished") || (errored && "error")}
                />
            </div>
        </Page>
    )
}