import { Breadcrumb, BreadcrumbItem, ClickableTile } from "@carbon/react"
import { useEffect } from "react"
import { Page, Title } from "../../components/layout/page"
import { HeaderTile } from "../../components/login-tile/login-tile"
import { loginRedirect } from "../../components/login-redirect/login-redirect"

import styles from './dashboard.module.scss'

export const Dashboard = () => {
    return (
        <Page>
            <Title>
                Manage your
                <br />
                Subscriptions.
            </Title>

            
            {/* <ClickableTile
                className={styles.tile}
                href="/dashboard/subscriptions"
            >
                <div className={styles.tile__label}>Edit your</div>
                <div className={styles.tile__title}>Subscriptions</div>
            </ClickableTile> */}
            <div className={styles.tile__container}>
                <HeaderTile
                    label={"Edit your"}
                    title={"Subscriptions"}
                    description={"Edit your existing subscriptions."}
                    buttonLabel={"Edit"}
                    href={"/dashboard/subscriptions"}
                    icon
                    className={styles.tile}
                />

                <HeaderTile
                    label={"Create a New"}
                    title={"Subscription"}
                    description={"Make a new subscription."}
                    buttonLabel={"Create"}
                    href={"/dashboard/new"}
                    icon
                    className={styles.tile}
                />
            </div>
        </Page>
    )
}