import styles from '@components/Button/Button.module.scss'

export interface IButtonProps {
    type: "button" | "submit" | "reset";
    disabled?: boolean;
    children: string;
    onClick?: () => void;
};

export default function Button(props: IButtonProps) {
    return (
        <button
            type={props.type}
            className={`${styles.btn} ${props.disabled ? styles.disabled : ""}`}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            <span>{props.children}</span>
        </button>
    );
}