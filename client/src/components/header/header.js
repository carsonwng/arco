import { useState } from 'react'
import { Header, HeaderGlobalAction, HeaderGlobalBar, SkipToContent, Button, Theme, HeaderPanel, Tile, ClickableTile, SwitcherDivider, SwitcherItem, Switcher, Tooltip } from '@carbon/react'
import { Add, Logout, ArrowRight } from '@carbon/icons-react'
import { motion } from 'framer-motion'
import styles from './header.module.scss'
import { HeaderTile, LoginTile } from '../login-tile/login-tile'
import { useDiscordStore } from '../../store/discordStore'

export const ArcoHeader = () => {
    const user = useDiscordStore()

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <Theme theme="g10">
            <Header aria-label="Arco">
                <SkipToContent />

                <div className={styles.container}>
                    <Button kind="ghost" size="sm" href="/">
                        <span className={styles.logo}>arco</span>
                    </Button>
                </div>
            
                <HeaderGlobalBar>
                    <HeaderGlobalAction
                        aria-label="Menu"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        isActive={isMenuOpen}
                    >
                        <motion.div
                            className={styles.menu__container}
                            animate={{ rotate: isMenuOpen ? 135 : 0 }}
                        >
                            <Add size="24"/>
                        </motion.div>
                    </HeaderGlobalAction>
                </HeaderGlobalBar>

                <HeaderPanel aria-label="aspdoka" expanded={isMenuOpen}>
                    {user.loggedIn ? (<>
                        <Tile className={styles.user__container}>
                            <div className={styles.user__inner__container}>
                                <img
                                    src={
                                        user.user.avatar ? (
                                            "https://cdn.discordapp.com/avatars/" + user.user.id + "/" + user.user.avatar + ".png"
                                        ) : (
                                            "https://cdn.discordapp.com/embed/avatars/" + (user.user.username.split("#")[1] % 5) + ".png"
                                        )
                                    }
                                    alt="User avatar"
                                    className={styles.user__avatar}
                                />

                                <div>
                                    <div className={styles.user__label}>
                                        Currently logged in as
                                    </div>
                                    <div className={styles.user__name}>
                                        {"@" + user.user.username.split("#")[0]}
                                        <span className={styles.user__label}>#{user.user.username.split("#")[1]}</span>
                                    </div>
                                </div>
                            </div>
                        </Tile>

                        <SwitcherDivider />

                        <HeaderTile
                            label="Take a Visit to your"
                            title="Dashboard"
                            description="Manage subscriptions, triggers, and more."
                            buttonLabel="Start Managing"
                            href={`/dashboard`}
                            icon
                        />

                        <SwitcherDivider />
                        
                        <HeaderTile
                            label="Learn more about"
                            title="This Project"
                            description="Everything about arco. Why, how, and more."
                            buttonLabel="Learn More"
                            href={`#`}
                            icon
                        />
                    
                        <Button
                            kind="danger"
                            size="lg"
                            className={styles.logout}
                            onClick={() => user.clear()}

                            renderIcon={Logout}
                        >
                            Log out
                        </Button>
                    </>) : (<>
                        <LoginTile />
                        <SwitcherDivider />
                    </>)}
                </HeaderPanel>
            </Header>
        </Theme>
    )
}