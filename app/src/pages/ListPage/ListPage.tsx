import Card from '@components/Card/Card';
import styles from '@pages/ListPage/ListPage.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getAllSuperheroes, type ISuperheroList } from '@store/SuperheroSlice';
import { useEffect } from 'react';
import Button from '@components/Button/Button';

export default function ListPage() {
    const dispatch = useAppDispatch();
    const { superheroesList, nextPageUrl, prevPageUrl, currentPage, totalPages, loading } = useAppSelector((state) => state.superheros);

    useEffect(() => {
        dispatch(getAllSuperheroes(null));
    }, [dispatch]);

    return (
        <div className={`${styles.listPage} ${loading ? styles.loading : ''}`}>
            <h1>Superhero List</h1>
            <div className={styles.cardContainer}>
                {superheroesList && superheroesList.length > 0 ? (
                    superheroesList.map((hero: ISuperheroList) => (
                        <Card key={hero._id} _id={hero._id} nickname={hero.nickname} images={hero.images} />
                    ))
                ) : (
                    <p>No superheroes found</p>
                )}
            </div>
            
            {superheroesList && superheroesList.length > 0 && (
                <div className={styles.pagination}>
                    <Button
                        type='button' 
                        disabled={!prevPageUrl || loading}
                        onClick={() => dispatch(getAllSuperheroes(prevPageUrl))}
                    >
                        Previous
                    </Button>
                    <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                    <Button
                        type='button'
                        disabled={!nextPageUrl || loading}
                        onClick={() => dispatch(getAllSuperheroes(nextPageUrl))}
                    >
                        Next
                    </Button>

                </div>
            )}
        </div>
    )
}