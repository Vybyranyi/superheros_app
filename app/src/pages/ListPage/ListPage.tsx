import Card from '@components/Card/Card';
import styles from '@pages/ListPage/ListPage.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getAllSuperheroes, type ISuperheroList } from '@store/SuperheroSlice';
import { useEffect } from 'react';


export default function ListPage() {

    const dispatch = useAppDispatch();
    const { superheroesList, loading, error } = useAppSelector((state) => state.superheros);

    useEffect(() => {
        dispatch(getAllSuperheroes());
    }, [dispatch]);

    return (

        <div>
            <h1>Superhero List</h1>
            {superheroesList ? (
                superheroesList.map((hero: ISuperheroList) => (
                    <Card key={hero._id} _id={hero._id} nickname={hero.nickname} images={hero.images} />
                ))
            ) : (
                <p>No superheroes found</p>
            )}
        </div>
    )
}