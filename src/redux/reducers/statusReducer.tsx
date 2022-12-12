import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http } from '../../util/config';
import { DispatchType } from '../configStore';

export interface Status {
    statusId:   string;
    statusName: string;
    alias:      string;
    deleted:    string;
}


interface StatusState {
    arrStatus: Status[]
}


const initialState: StatusState = {
    arrStatus: []
}

const statusReducer = createSlice({
  name: 'statusReducer',
  initialState,
  reducers: {
    setArrStatus: (state: StatusState, action:PayloadAction<Status[]>) => {
        const arrStatus: Status[] = action.payload;
        state.arrStatus = arrStatus
    }
  }
});

export const {setArrStatus} = statusReducer.actions

export default statusReducer.reducer


export const getAllStatusAPI = () => {
    return async (dispatch:DispatchType) => {
        const result = await http.get('/api/Status/getAll');
        const arrStatus: Status[] = result.data.content;
        const action: PayloadAction<Status[]> = setArrStatus(arrStatus);
        dispatch(action);
    }
}