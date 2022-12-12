import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config';
import { DispatchType } from '../configStore';

export interface commentContent {
    taskId: number,
    contentComment: string
}

export interface CommentType {
    user: User;
    id: number;
    userId: number;
    taskId: number;
    contentComment: string;
    deleted: boolean;
    alias: string;
}

export interface User {
    userId: number;
    name: string;
    avatar: string;
}

interface CommentState {
    arrComment: CommentType[] | undefined | null
}

const initialState: CommentState = {
    arrComment: [],
}

const commentReducer = createSlice({
    name: 'commentReducer',
    initialState,
    reducers: {
        setArrComment: (state: CommentState, action: PayloadAction<CommentType[]>) => {
            const arrComment: CommentType[] = action.payload;
            state.arrComment = arrComment;
        },
    }
});

export const { setArrComment } = commentReducer.actions

export default commentReducer.reducer


export const addCommentAPI = (value: commentContent, taskId: number) => {
    return async (dispatch: DispatchType) => {
        await http.post('/api/Comment/insertComment', value);
        const actionComment = getAllCommentAPI(taskId)
        dispatch(actionComment)
    }
}


export const getAllCommentAPI = (taskID: number) => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.get(`/api/Comment/getAll?taskId=${taskID}`);
        let arrComment = result.data.content;
        const action: PayloadAction<CommentType[]> = setArrComment(arrComment);
        dispatch(action);
    }
}

export const updateCommentAPI = (commentId: number, commentUpdate: string, taskId: number) => {
    return async (dispatch: DispatchType) => {
        await http.put(`/api/Comment/updateComment?id=${commentId}&contentComment=${commentUpdate}`);
        const actionGetComment = getAllCommentAPI(taskId);
        dispatch(actionGetComment);
    }
}

export const deleteCommentAPI = (commentId: number, taskId: number) => {
    return async (dispatch: DispatchType) => {
        await http.delete(`/api/Comment/deleteComment?idComment=${commentId}`);
        const actionGetComment = getAllCommentAPI(taskId);
        dispatch(actionGetComment);
    }
}


