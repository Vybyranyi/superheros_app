import { configureStore } from '@reduxjs/toolkit';
import superherosReducer from '@store/SuperheroSlice';

export const store = configureStore({
    reducer: {
        superheros: superherosReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;