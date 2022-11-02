import { Button, Tile } from "@carbon/react"
import { useEffect, useState } from "react"
import { Page, Title } from "../../components/layout/page"
import { loginRedirect } from "../../components/login-redirect/login-redirect"
import axios from "axios"
import styles from './manage-subscriptions.module.scss'
import { useDiscordStore } from "../../store/discordStore"

export const ManageSubscriptions = () => {
    const user = useDiscordStore()
    const [subscriptions, setSubscriptions] = useState([])

    const getSubscriptions = async (set) => {
        const webhookId = await axios.post("http://147.182.152.192:3002/id", {
            id: user.user.id
        })

        const subscriptions = await axios.get(`http://147.182.152.192:3001/subscriptions?webhook_id=http://147.182.152.192:3002/webhooks/${webhookId.data.webhook_id}`)
        set(subscriptions.data)
    }

    useEffect(() => {
        getSubscriptions(setSubscriptions)
    }, [])

    return (
        <Page>
            <Title>
                Current Subscriptions:
            </Title>

            <div className={styles.tile__container}>
                {subscriptions.map((subscription, index) => {
                    return (
                        <Tile className={styles.tile}>
                            <div className={styles.field}>
                                <div>Subscription Condition(s):</div>
                                <div>
                                    {(JSON.stringify(subscription.trigger.condition)).includes("receiver") && (JSON.stringify(subscription.trigger.condition)).includes("sender") ? "Sender or Receiver" : (JSON.stringify(subscription.trigger.condition)).includes("receiver") ? "Receiver" : (JSON.stringify(subscription.trigger.condition)).includes("sender") && "Sender"}
                                </div>
                            </div>

                            <div className={styles.field}>
                                <div>Subscription Target:</div>
                                <div>{subscription.trigger.condition_target}</div>
                            </div>

                            <div className={styles.field}>
                                <div>Webhook URL:</div>
                                <div>{subscription.webhook}</div>
                            </div>

                            <Button kind="danger" onClick={() => {
                                axios.delete(`http://147.182.152.192:3001/subscriptions?id=${subscription._id}`)
                                getSubscriptions(setSubscriptions)
                            }}>Delete</Button>
                        </Tile>
                    )
                })}
            </div>
        </Page>
    )
}