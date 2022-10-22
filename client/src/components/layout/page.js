import styles from './page.module.scss'

export const Page = ({
    children
}) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}

export const Title = ({
    children
}) => {
    return (
        <div className={styles.title}>
            {children}
        </div>
    )
}