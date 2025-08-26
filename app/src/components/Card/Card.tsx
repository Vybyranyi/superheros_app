import styles from '@components/Card/Card.module.scss';


const API_URL = import.meta.env.VITE_API_URL;

export interface ICardProps {
    _id: string;
    nickname: string;
    images: string[];
    onClick?: () => void;
}

export default function Card(props: ICardProps) {
    return (
        <div className={styles.card} key={props._id} onClick={props.onClick}>
            <img src={`${API_URL}${props.images[0]}`} alt={props.nickname} />
            <h2>{props.nickname}</h2>
        </div>
    )
}
