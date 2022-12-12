import {configureStore} from '@reduxjs/toolkit';
import commentReducer from './reducers/commentReducer';
import modalReducer from './reducers/modalReducer';
import priorityReducer from './reducers/priorityReducer';
import projectReducer from './reducers/projectReducer';
import statusReducer from './reducers/statusReducer';
import taskReducer from './reducers/taskReducer';
import userReducer from './reducers/userReducer';


export const store = configureStore({
    reducer: {
        userReducer: userReducer,
        projectReducer: projectReducer,
        modalReducer: modalReducer,
        priorityReducer: priorityReducer,
        taskReducer: taskReducer,
        statusReducer: statusReducer,
        commentReducer: commentReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type DispatchType = typeof store.dispatch;