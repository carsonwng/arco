import { useEffect, useState } from "react"
import { Title, Page } from "../../components/layout/page"
import { loginRedirect } from "../../components/login-redirect/login-redirect"
import axios from "axios"
import styles from './new-subscription.module.scss'
import { Button, Select, SelectItem, TextInput, Toggle } from "@carbon/react"
import { useDiscordStore } from "../../store/discordStore"

export const NewSubscription = () => {
    const user = useDiscordStore()

    const [condition, setCondition] = useState("Sender OR Receiver")
    const [target, setTarget] = useState("")
    const [customWebhook, setCustomWebhook] = useState(false)
    const [customWebhookUrl, setCustomWebhookUrl] = useState("")
    const [error, setError] = useState("")
    const [complete, setComplete] = useState(false)

    const handleChangeLogic = (e) => {
        setCondition(e.target.value)
    }

    const handleChangeTarget = (e) => {
        setTarget(e.target.value)
    }

    const handleChangeCustomWebhook = (e) => {
        setCustomWebhook(!customWebhook)
    }

    const handleSubmit = async () => {
        if (!customWebhook) {
            let triggerCondition;

            switch(condition) {
                case "Sender OR Receiver":
                    triggerCondition = {
                        "or": [
                            {
                                "==": [
                                    {
                                        "var": "sender"
                                    },
                                    target
                                ]
                            },
                            {
                                "==": [
                                    {
                                        "var": "receiver"
                                    },
                                    target
                                ]
                            }
                        ]
                    }
                
                    break
                case "Sender":
                    triggerCondition = {
                        "==": [
                            {
                                "var": "sender"
                            },
                            target
                        ]
                    }

                    break
                case "Receiver":
                    triggerCondition = {
                        "==": [
                            {
                                "var": "receiver"
                            },
                            target
                        ]
                    }

                    break
                default:
                    break
            }

            try {
                const webhookId = await axios.post("http://147.182.152.192:3002/id", {
                    id: user.user.id
                })

                const webhook = customWebhook ? customWebhookUrl : `http://147.182.152.192:3002/webhooks/${webhookId.data.webhook_id}`

                await axios.post(`http://147.182.152.192:3001/subscriptions`, {
                    trigger: {
                        network: "algorand",
                        condition_type: "address",
                        condition_target: target,
                        condition: triggerCondition
                    },
                    webhook: webhook
                })

                setComplete(true)
            } catch (err) {
                console.error(err)

                setError(err.message)
            }
        }
    }

    return (
        <Page>
            <Title>
                Create a New
                <br />
                Subscription.
            </Title>

            <div className={styles.form__container} style={{ marginTop: "72px" }}>
                <div className={styles.label}>
                    Notify me when the
                </div>

                <Select
                    id="select-1"
                    labelText=""
                    inline
                    
                    value={condition}
                    onChange={handleChangeLogic}
                >
                    <SelectItem
                        id="item-1"
                        text="Sender OR Receiver"
                        value="Sender OR Receiver"
                    />
                    <SelectItem
                        id="item-2"
                        text="Sender"
                        value="Sender"
                    />
                    <SelectItem
                        id="item-3"
                        text="Receiver"
                        value="Receiver"
                    />
                </Select>
            </div>

            <div className={styles.form__container}>
                <div className={styles.label} style={{ paddingRight: "16px" }}>
                    of a transaction is
                </div>

                <TextInput
                    id="text-input-1"
                    className={styles.input}
                    placeholder="Enter Algorand Address"

                    value={target}
                    onChange={handleChangeTarget}

                    invalid={target.length !== 58}
                    invalidText="Invalid Algorand Address"

                    labelText=""
                />
            </div>

            <div className={styles.form__container} style={{ marginTop: "64px" }}>
                <Toggle
                    id="toggle-1"
                    labelText="Custom Webhook"

                    toggled={customWebhook}
                    onClick={handleChangeCustomWebhook}
                />
            </div>

            {customWebhook && (
                <div className={styles.form__container}>
                    <TextInput
                        id="text-input-2"
                        className={styles.input}
                        placeholder="Enter Webhook URL"

                        labelText=""

                        value={customWebhookUrl}
                        onChange={e => setCustomWebhookUrl(e.target.value)}
                    />
                </div>
            )}

            <div style={{ marginTop: "64px" }}>
                <Button onClick={handleSubmit} disabled={target.length !== 58}>
                    Submit
                </Button>
            </div>

            {error && (
                <div className={styles.label} style={{ marginTop: "16px" }}>
                    Error: {error}
                </div>
            )}

            {complete && (
                <div className={styles.label} style={{ marginTop: "16px" }}>
                    Subscription Created!
                </div>
            )}
        </Page>
    )
}