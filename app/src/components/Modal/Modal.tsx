import { useEffect, useState } from 'react';
import styles from '@components/Modal/Modal.module.scss';
import edit from '@assets/images/edit.svg';
import remove_cross from '@assets/images/remove_cross.svg';
import trash_can from '@assets/images/trash_can.svg';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getByIdSuperhero } from '@store/SuperheroSlice';

const API_URL = import.meta.env.VITE_API_URL;

export interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    superheroId: string | null;
}

export default function Modal(props: IModalProps) {
    const dispatch = useAppDispatch();
    const { currentSuperhero, loading } = useAppSelector(state => state.superheros);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (props.isOpen && props.superheroId) {
            dispatch(getByIdSuperhero(props.superheroId));
            setSelectedImageIndex(0);
        }
    }, [props.isOpen, props.superheroId, dispatch]);

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            props.onClose();
        }
    };

    if (!props.isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{loading ? 'Loading...' : 'Superhero Details'}</h2>
                    <div className={styles.btnsContainer}>
                        <button
                            onClick={props.onClose} >
                            <img src={edit} alt="Close" />
                        </button>
                        <button onClick={props.onClose} >
                            <img src={trash_can} alt="Close" />
                        </button>
                        <button onClick={props.onClose} >
                            <img src={remove_cross} alt="Close" />
                        </button>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    {loading ? (
                        <p>Loading superhero details...</p>
                    ) : currentSuperhero ? (
                        <>
                            {currentSuperhero.images && currentSuperhero.images.length > 0 && (
                                <div className={styles.imageGallery}>
                                    <img
                                        src={`${API_URL}${currentSuperhero.images[selectedImageIndex]}`}
                                        alt={currentSuperhero.nickname}
                                        className={styles.mainImage}
                                    />
                                    {currentSuperhero.images.length > 1 && (
                                        <div className={styles.thumbnails}>
                                            {currentSuperhero.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={`${API_URL}${image}`}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <h4>Nick Name</h4>
                                    <p>{currentSuperhero.nickname}</p>
                                </div>

                                <div className={styles.detailItem}>
                                    <h4>Real Name</h4>
                                    <p>{currentSuperhero.real_name}</p>
                                </div>

                                <div className={styles.detailItem}>
                                    <h4>Origin Story</h4>
                                    <p>{currentSuperhero.origin_description}</p>
                                </div>

                                <div className={styles.detailItem}>
                                    <h4>Superpowers</h4>
                                    <div className={styles.powersContainer}>
                                        {currentSuperhero.superpowers.map((power, index) => (
                                            <span key={index} className={styles.powerTag}>
                                                {power}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.detailItem}>
                                    <h4>Catchphrase</h4>
                                    <p>"{currentSuperhero.catch_phrase}"</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Superhero not found</p>
                    )}
                </div>
            </div>
        </div>
    );
}