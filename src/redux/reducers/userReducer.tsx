import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ACCESSTOKEN, history, http, settings, USER_PROFILE } from '../../util/config';
import { DispatchType } from '../configStore';
import swal from 'sweetalert';
import { getProjectAllAPI } from './projectReducer';


export interface userProfile {
  id: number;
  email: string;
  avatar: string;
  phoneNumber: string;
  name: string;
  accessToken: string;
}

export interface Account {
  email: string;
  passWord: string;
}

export interface AccountSignUp {
  email: string;
  passWord: string;
  name: string;
  phoneNumber: string;
}


export interface getUser {
  userId: number;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
}



interface UserState {
  userProfile: userProfile | undefined | null,
  messageErrorLogin: string,
  messageSignUp: string,
  arrGetUser: getUser[] | undefined | null,
  messageAddUser: string,
  messageAddUserError: string
}



const initialState: UserState = {
  userProfile: null,
  messageErrorLogin: '',
  messageSignUp: '',
  arrGetUser: null,
  messageAddUser: '',
  messageAddUserError: ''
}

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setUserProfile: (state: UserState, action: PayloadAction<userProfile>) => {
      const userProfile: userProfile = action.payload;
      state.userProfile = userProfile;
    },
    setMessageErrorLogin: (state: UserState, action: PayloadAction<string>) => {
      const message: string = action.payload;
      state.messageErrorLogin = message;
      swal({
        title: state.messageErrorLogin,
        icon: "warning",
      });
    },
    setMessageSignUp: (state: UserState, action: PayloadAction<string>) => {
      const message: string = action.payload;
      state.messageSignUp = message;
      swal({
        title: state.messageSignUp,
        icon: "success",
      });
    },
    setGetUser: (state: UserState, action: PayloadAction<getUser[]>) => {
      const getUser: getUser[] = action.payload;
      state.arrGetUser = getUser;
    },
    setMessageAddUser: (state: UserState, action: PayloadAction<string>) => {
      const message: string = action.payload;
      state.messageAddUser = message;
      swal({
        title: state.messageAddUser,
        icon: "success",
      });
    },
    setMessageAddUserError:  (state: UserState, action: PayloadAction<string>) => {
      const message: string = action.payload;
      state.messageAddUser = message;
      swal({
        title: state.messageAddUser,
        icon: "error",
      });
    },
  }
});

export const {setMessageAddUserError, setMessageAddUser, setGetUser, setMessageSignUp, setMessageErrorLogin, setUserProfile } = userReducer.actions

export default userReducer.reducer;


export const postSigninAPI = (user: Account) => {
  return async (dispatch: DispatchType) => {
    try {
      const result: any = await http.post("/api/Users/signin", user);
      let profile: userProfile = result.data.content;
      const action: PayloadAction<userProfile> = setUserProfile(profile);
      dispatch(action);
      settings.setStorage(ACCESSTOKEN, result.data.content.accessToken);
      settings.setStorageJson(USER_PROFILE, result.data.content);
      history.push('')
    } catch (err: any) {
      let message: string = err.response.data.message;
      console.log(err)
      const action: PayloadAction<string> = setMessageErrorLogin(message);
      dispatch(action);
    }
  }
}

export const postSignUpAPI = (account: AccountSignUp) => {
  return async (dispatch: DispatchType) => {
    const result: any = await http.post('/api/Users/signup', account);
    const message: string = result.data.message;
    const action: PayloadAction<string> = setMessageSignUp(message);
    dispatch(action);
  }
}



export const getUserAPI = (value: string) => {
  return async (dispatch: DispatchType) => {
    const result: any = await http.get(`/api/Users/getUser?keyword=${value}`)
    const user: getUser[] = result.data.content;
    const action: PayloadAction<getUser[]> = setGetUser(user);
    dispatch(action)

  }
}


export const assignUserProject = (projectID: number, userID: number) => {
  return async (dispatch: DispatchType) => {
    try {
      const result: any = await http.post('/api/Project/assignUserProject', {
        projectId: projectID,
        userId: userID
      })
      const message: string = result.data.message;
      const action: PayloadAction<string> = setMessageAddUser(message);
      await dispatch(action);
      const actionGetAllProject = getProjectAllAPI();
      dispatch(actionGetAllProject);
    } catch (err: any) {
      let message: string = err.response.data.message;
      console.log(err)
      const action: PayloadAction<string> = setMessageAddUserError(message);
      dispatch(action);
    }
  }
}

export const removeUserProjectAPI = (projectID: number, userID: number) => {
  return async (dispatch: DispatchType) => {
    try {
      const result: any = await http.post('/api/Project/removeUserFromProject', {
        projectId: projectID,
        userId: userID
      })
      const message: string = result.data.message;
      const action: PayloadAction<string> = setMessageAddUser(message);
      await dispatch(action);
      const actionGetAllProject = getProjectAllAPI();
      dispatch(actionGetAllProject);
    } catch (err: any) {
      let message: string = err.response.data.message;
      console.log(err)
      const action: PayloadAction<string> = setMessageAddUserError(message);
      dispatch(action);
    }
  }
}