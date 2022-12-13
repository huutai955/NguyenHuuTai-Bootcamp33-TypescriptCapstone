import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ACCESSTOKEN, history, http, settings, show, USER_PROFILE } from '../../util/config';
import { DispatchType } from '../configStore';
import swal from 'sweetalert';
import { getDetailProjectByIdAPI, getProjectAllAPI } from './projectReducer';
import { notification } from 'antd';


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

export interface Members {
  userId: number;
  name: string;
  avatar: string;
  email: null;
  phoneNumber: null;
}




interface UserState {
  userProfile: userProfile | undefined | null,
  messageErrorLogin: string,
  messageSignUp: string,
  arrGetUser: getUser[] | undefined | null,
  messageAddUser: string,
  messageAddUserError: string,
  arrUser: getUser[]
  arrMembers: Members[] | undefined | null
  userInfor: getUser[]
}



const initialState: UserState = {
  userProfile: null || settings.getStorageJson("userProfile"),
  messageErrorLogin: '',
  messageSignUp: '',
  arrGetUser: null,
  messageAddUser: '',
  messageAddUserError: '',
  arrUser: [],
  arrMembers: [],
  userInfor: []
}

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    setUserProfile: (state: UserState, action: PayloadAction<userProfile | null>) => {
      const userProfile: userProfile | null = action.payload;
      state.userProfile = userProfile;
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
    setArrUser: (state: UserState, action: PayloadAction<getUser[]>) => {
      const getUser: getUser[] = action.payload;
      state.arrUser = getUser;
    },
    setArrMembers: (state: UserState, action: PayloadAction<Members[]>) => {
      const getUser: Members[] = action.payload;
      state.arrMembers = getUser;
    },
    setUserInfor: (state: UserState, action: PayloadAction<getUser[]>) => {
      const user: getUser[] = action.payload;
      state.userInfor = user;
    }
  }
});

export const { setUserInfor, setArrMembers, setArrUser, setGetUser, setMessageSignUp, setUserProfile } = userReducer.actions

export default userReducer.reducer;



export const getUserByIdAPI = (userId: number) => {
  return async (dispatch: DispatchType) => {
    const result: any = await http.get(`/api/Users/getUser?keyword=${userId}`)
    const user: getUser[] = result.data.content;
    const action: PayloadAction<getUser[]> = setUserInfor(user);
    dispatch(action)
  }
}

export const editUserAPI = (value: any) => {
  return async (dispatch: DispatchType) => {
    await http.put(`/api/Users/editUser`, value)
    const actionGetAllUser = getAllUserAPI();
    dispatch(actionGetAllUser);
    show('success', 'Success', 'Update user successfully!!');
  }
}



export const postSigninAPI = (user: Account) => {
  return async (dispatch: DispatchType) => {
    try {
      const result: any = await http.post("/api/Users/signin", user);
      let profile: userProfile = result.data.content;
      const action: PayloadAction<userProfile | null> = setUserProfile(profile);
      dispatch(action);
      settings.setStorage(ACCESSTOKEN, result.data.content.accessToken);
      settings.setStorageJson(USER_PROFILE, result.data.content);
      history.push('/projects')
    } catch (err: any) {
      swal({
        icon: 'error',
        title: 'Have something wrong.Check your email or password again!!'
      })
    }
  }
}

export const postSignUpAPI = (account: AccountSignUp) => {
  return async (dispatch: DispatchType) => {
    const result: any = await http.post('/api/Users/signup', account);
    const message: string = result.data.message;
    const action: PayloadAction<string> = setMessageSignUp(message);
    dispatch(action);
    history.push('/')
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

export const getAllUserAPI = () => {
  return async (dispatch: DispatchType) => {
    const result: any = await http.get(`/api/Users/getUser`)
    const user: getUser[] = result.data.content;
    const action: PayloadAction<getUser[]> = setArrUser(user);
    dispatch(action)

  }
}

export const findingUserAPI = (value: string) => {
  return async (dispatch: DispatchType) => {
    if (value !== "") {
      const result: any = await http.get(`/api/Users/getUser?keyword=${value}`)
      const user: getUser[] = result.data.content;
      const action: PayloadAction<getUser[]> = setArrUser(user);
      dispatch(action)
    } else {
      const result: any = await http.get(`/api/Users/getUser`)
      const user: getUser[] = result.data.content;
      const action: PayloadAction<getUser[]> = setArrUser(user);
      dispatch(action)
    }
  }
}




export const assignUserProject = (projectID: number, userID: number) => {
  return async (dispatch: DispatchType) => {
    try {
      await http.post('/api/Project/assignUserProject', {
        projectId: projectID,
        userId: userID
      })
      const actionGetAllProject = getProjectAllAPI();
      dispatch(actionGetAllProject);
      show('success', 'Success', 'Successfully add user')
    } catch (err: any) {
      show('error', 'Error', `You are not project's creator`)
    }
  }
}

export const assignUserProjectInCreateProject = (projectID: number, userID: number) => {
  return async (dispatch: DispatchType) => {
    try {
      await http.post('/api/Project/assignUserProject', {
        projectId: projectID,
        userId: userID
      })
      const actionGetDetailProject = getDetailProjectByIdAPI(projectID);
      dispatch(actionGetDetailProject);
      show('success', 'Success', 'Add user successfully!!');
    } catch (err: any) {
      if (err.response.data.content === "User already exists in the project!") {
        show('error', 'Error', `User already exists in the project!`);
      } else if (err.response.data.content === "User is unthorization!") {
        show('error', 'Error', `You are not project's creator!!`);
      }
    }
  }
}

export const removeUserProjectAPI = (projectID: number, userID: number) => {
  return async (dispatch: DispatchType) => {
    try {
      await http.post('/api/Project/removeUserFromProject', {
        projectId: projectID,
        userId: userID
      })
      const actionGetAllProject = getProjectAllAPI();
      dispatch(actionGetAllProject);
      show("success", 'Success', 'Successfully remove user!!')
    } catch (err: any) {
      show('error', 'Error', `You are not project's creator`)
    }
  }
}

export const removeUserProjectAPIInCreatePost = (projectID: number, userID: number) => {
  return async (dispatch: DispatchType) => {
    try {
      await http.post('/api/Project/removeUserFromProject', {
        projectId: projectID,
        userId: userID
      })
      const actionDetailProject = getDetailProjectByIdAPI(projectID);
      dispatch(actionDetailProject);
      show('success', 'Success', 'remove user successfully!!');
    } catch (err: any) {
      show('error', 'Error', `You are not project's creator`);
    }
  }
}

export const removeUserAPI = (userID: number) => {
  return async (dispatch: DispatchType) => {
    try {
      await http.delete(`/api/Users/deleteUser?id=${userID}`)
      const actionGetAllUser = getAllUserAPI();
      dispatch(actionGetAllUser);
      show('success', 'Success', 'Delete user successfully!!');
    } catch (err: any) {
      show('error', 'Delete user failed', 'This is special case, you can not remove this user');
    }
  }
}


export const getArrMembersByProjectID = (value: number) => {
  return async (dispatch: DispatchType) => {
    try {
      const result: any = await http.get(`/api/Users/getUserByProjectId?idProject=${value}`)
      const arrMembers: Members[] = result.data.content;
      const action: PayloadAction<Members[]> = setArrMembers(arrMembers);
      dispatch(action)
    } catch (err) {
      const arrMembers: Members[] = []
      const action: PayloadAction<Members[]> = setArrMembers(arrMembers);
      dispatch(action)
    }
  }
}
