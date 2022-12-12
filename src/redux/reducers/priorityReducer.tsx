import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config';
import { DispatchType } from '../configStore';

export interface Priority {
    priorityId:  number;
    priority:    string;
    description: string;
    deleted:     boolean;
    alias:       string;
}


interface PriorityState {
    arrPriority: Priority[]
}


const initialState: PriorityState = {
    arrPriority: []
}

const priorityReducer = createSlice({
  name: 'priorityReducer',
  initialState,
  reducers: {
    setArrPriority: (state: PriorityState, action:PayloadAction<Priority[]>) => {
        const arrPriority: Priority[] = action.payload;
        state.arrPriority = arrPriority
    }
  }
});

export const {setArrPriority} = priorityReducer.actions

export default priorityReducer.reducer


export const getAllPriorityAPI = () => {
    return async (dispatch:DispatchType) => {
        const result = await http.get('/api/Priority/getAll?id=0');
        const arrPriority: Priority[] = result.data.content;
        const action: PayloadAction<Priority[]> = setArrPriority(arrPriority);
        dispatch(action);
    }
}