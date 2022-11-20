import {configureStore} from '@reduxjs/toolkit';
import modalReducer from './reducers/modalReducer';
import projectReducer from './reducers/projectReducer';
import userReducer from './reducers/userReducer';


export const store = configureStore({
    reducer: {
        userReducer: userReducer,
        projectReducer: projectReducer,
        modalReducer: modalReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type DispatchType = typeof store.dispatch;