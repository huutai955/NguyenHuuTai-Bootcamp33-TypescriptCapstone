import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface Modal  {
    visible: boolean
}

const initialState = {
    visible: false
}

const modalReducer = createSlice({
  name: 'modalReducer',
  initialState,
  reducers: {
    setVisible: (state: Modal, action: PayloadAction<boolean>) => {
        const value: boolean = action.payload;
        state.visible = value;
    }
  }
});

export const {setVisible} = modalReducer.actions

export default modalReducer.reducer