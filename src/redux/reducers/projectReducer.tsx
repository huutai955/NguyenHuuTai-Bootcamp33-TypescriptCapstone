import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import swal from 'sweetalert';
import { ACCESSTOKEN, http } from '../../util/config';
import { DispatchType } from '../configStore';


export interface Project {
    members: Member[];
    creator: Creator;
    id: number;
    projectName: string;
    description: string;
    categoryId: number;
    categoryName: string;
    alias: string;
    deleted: boolean;
}

export interface Creator {
    id: number;
    name: string;
}

export interface Member {
    userId: number;
    name: string;
    avatar: string;
}

export interface DetailProject {
    lstTask: LstTask[];
    members: Member[];
    creator: Creator;
    id: number;
    projectName: string;
    description: string;
    projectCategory: Creator;
    alias: string;
}

export interface Creator {
    id: number;
    name: string;
}

export interface LstTask {
    lstTaskDeTail: any[];
    statusId: string;
    statusName: string;
    alias: string;
}

export interface DetailProjectMember {
    userId: number;
    name: string;
    avatar: string;
    email: null;
    phoneNumber: null;
}

export interface CategoryProject {
    id: number;
    projectCategoryName: string;
}

export interface ProjectCreate {
    projectName: string;
    description: string;
    categoryId:  number;
}

interface ProjectState {
    arrProject: Project[],
    detailProject: DetailProject | null | undefined ,
    idDeleted: number | null,
    messageUpdate: string | null,
    arrCategory: CategoryProject[] | null | undefined | any,
    messageCreate: string
}


const initialState: ProjectState = {
    arrProject: [],
    detailProject: null,
    idDeleted: null,
    messageUpdate: '',
    arrCategory: [],
    messageCreate: ''
}

const projectReducer = createSlice({
    name: 'projectReducer',
    initialState,
    reducers: {
        setArrProject: (state: ProjectState, action: PayloadAction<Project[]>) => {
            const arrProject: Project[] = action.payload;
            state.arrProject = arrProject
        },
        setArrCategory: (state: ProjectState, action: PayloadAction<CategoryProject[]>) => {
            const arrCategory: CategoryProject[] = action.payload;
            state.arrCategory = arrCategory
        },
        setDetailProject: (state: ProjectState, action: PayloadAction<DetailProject>) => {
            const detail: DetailProject = action.payload;
            state.detailProject = { ...detail };
        },
        setMessageDelete: (state: ProjectState, action: PayloadAction<number>) => {
            const numberDelete: number = action.payload;
            state.idDeleted = numberDelete;
        },
        setMessageUpdate: (state: ProjectState, action: PayloadAction<string>) => {
            const message: string = action.payload;
            state.messageUpdate = message;
        },
        setMessageCreate: (state: ProjectState, action: PayloadAction<string>) => {
            const message: string = action.payload;
            state.messageCreate = message;
            swal({
                title: state.messageCreate,
                icon: "success",
              });
        },
    }
});

export const {setMessageCreate, setArrCategory, setMessageUpdate, setMessageDelete, setArrProject, setDetailProject } = projectReducer.actions

export default projectReducer.reducer

export const getProjectAllAPI = () => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.get('/api/Project/getAllProject');
        let arrProject: Project[] = result.data.content;
        const action: PayloadAction<Project[]> = setArrProject(arrProject);
        dispatch(action);
    }
}


export const getProjectCategoryAPI = () => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.get('/api/ProjectCategory');
        let arrCategory: CategoryProject[] = result.data.content;
        const action: PayloadAction<CategoryProject[]> = setArrCategory(arrCategory);
        dispatch(action);
    }
}


export const getDetailProjectByIdAPI = (id: number) => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.get(`/api/Project/getProjectDetail?id=${id}`);
        let detailProject: DetailProject = result.data.content;
        const action: PayloadAction<DetailProject> = setDetailProject(detailProject);
        dispatch(action);
    }
}

export const deleteProjectAPI = (id: number) => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.delete(`/api/Project/deleteProject?projectId=${id}`);
        let number: number = result.data.content;
        const action: PayloadAction<number> = setMessageDelete(number);
        await dispatch(action);
        const actionGetAllProject = getProjectAllAPI();
        dispatch(actionGetAllProject);
    }
}

export const updateProjectAPI = (id: number | string, data: any) => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.put(`/api/Project/updateProject?projectId=${id}`, data);
        let message: string = result.data.message;
        const action: PayloadAction<string> = setMessageUpdate(message);
        await dispatch(action);
        const actionGetAllProject = getProjectAllAPI();
        dispatch(actionGetAllProject);
    }
}


export const createProjectAPI = (value:ProjectCreate) => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.post(`/api/Project/createProject`, value);
        let message: string = result.data.message;
        const action: PayloadAction<string> = setMessageCreate(message);
        dispatch(action);
    }
}


