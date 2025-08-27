import styles from "@components/Footer/Footer.module.scss";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <h4>Special for JavaScript Ninjas</h4>
                <h5>By Marian Vybyranyi</h5>
                <h6>© 2025 Superhero App</h6>
            </div>
        </footer>
    );
}