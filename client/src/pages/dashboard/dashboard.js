import { Breadcrumb, BreadcrumbItem } from "@carbon/react"
import { Page, Title } from "../../components/layout/page"

import styles from './dashboard.module.scss'

export const Dashboard = () => {
    return (
        <Page>
            <Breadcrumb className={styles.breadcrumb}>
                <BreadcrumbItem href="/dashboard" isCurrentPage>
                    Dashboard
                </BreadcrumbItem>
            </Breadcrumb>

            <Title>
                Manage your
                <br />
                Subscriptions.
            </Title>

            

        </Page>
    )
}