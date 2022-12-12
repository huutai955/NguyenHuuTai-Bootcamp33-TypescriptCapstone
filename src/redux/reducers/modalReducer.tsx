import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface Modal {
  visible: boolean
  visibleTask: boolean
  visibleEditTask: boolean
  visibleEditUser: boolean
}

const initialState = {
  visible: false,
  visibleTask: false,
  visibleEditTask: false,
  visibleEditUser: false
}

const modalReducer = createSlice({
  name: 'modalReducer',
  initialState,
  reducers: {
    setVisible: (state: Modal, action: PayloadAction<boolean>) => {
      const value: boolean = action.payload;
      state.visible = value;
    },
    setVisibleTask: (state: Modal, action: PayloadAction<boolean>) => {
      const value: boolean = action.payload;
      state.visibleTask = value;
    },
    setVisibleEditTask: (state: Modal, action: PayloadAction<boolean>) => {
      const value: boolean = action.payload;
      state.visibleEditTask = value;
    },
    setVisibleEditUser: (state: Modal, action: PayloadAction<boolean>) => {
      const value: boolean = action.payload;
      state.visibleEditUser = value;
    }
  }
});

export const {setVisibleEditUser,setVisibleEditTask, setVisible, setVisibleTask } = modalReducer.actions

export default modalReducer.reducer