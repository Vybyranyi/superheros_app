import styles from "@components/Header/Header.module.scss";
import { useNavigate, useLocation } from "react-router";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <h1>Superhero App</h1>
                <div className={styles.headerButtons}>
                    <button 
                        type="button" 
                        className={`${styles.headerButton} ${location.pathname === '/form' ? styles.primary : ''}`}
                        onClick={() => navigate('/form')}
                    >
                    Add new
                    </button>
                    <button 
                        type="button" 
                        className={`${styles.headerButton} ${location.pathname === '/' ? styles.primary : ''}`}
                        onClick={() => navigate('/')}
                    >
                    List
                    </button>
                </div>
            </div>
        </header>
    );
}