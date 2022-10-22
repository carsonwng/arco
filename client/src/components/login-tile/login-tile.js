import { ClickableTile } from "@carbon/react"
import { ArrowRight } from "@carbon/icons-react"
import { motion } from "framer-motion"
import styles from "./login-tile.module.scss"

export const HeaderTile = ({
    label = "",
    title = "",
    description = "",
    buttonLabel = "",
    href = "",
    icon = true
}) => {
    return (
        <motion.div
            className={styles.container}
            whileHover="hover"
        >
            <ClickableTile href={href}>
                <div className={styles.label}>{label}</div>
                <div className={styles.title}>{title}</div>

                <p className={styles.description}>
                    {description}
                </p>

                {icon && (
                    <div className={styles.icon__container}>
                        <div className={styles.icon__label}>{buttonLabel}</div>

                        <motion.div
                            variants={{
                                hover: { x: [0, 10, 0] }
                            }}
                            transition={{
                                ease: "easeInOut",
                                duration: 0.5,
                                times: [0, 0.5, 1],
                            }}
                        >
                            <ArrowRight size="20" />
                        </motion.div>
                    </div>
                )}
            </ClickableTile>
        </motion.div>
    )
}

export const LoginTile = () => {
    return (
        <HeaderTile
            label="Log in with"
            title="Discord"
            description="The only information arco will be able to access is your Discord username, ID, and your avatar."
            buttonLabel="Bring me there"
            href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_DISCORD_REDIRECT_URI}&response_type=token&scope=identify`}
            icon
        />
    )
}