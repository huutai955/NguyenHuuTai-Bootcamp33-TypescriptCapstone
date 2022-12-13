import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import swal from 'sweetalert';
import { ACCESSTOKEN, http, show } from '../../util/config';
import { DispatchType } from '../configStore';
import { getUser } from './userReducer';


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
    members: Member[] | getUser[];
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
    categoryId: number;
}

export interface ProjectUpdate {
    projectName: string;
    description: string;
    categoryId: number;
    id: number
}




interface ProjectState {
    arrProject: Project[],
    detailProject: DetailProject | null | undefined,
    arrCategory: CategoryProject[] | null | undefined | any,
    arrProjectFinding: Project[]
}


const initialState: ProjectState = {
    arrProject: [],
    detailProject: null,
    arrCategory: [],
    arrProjectFinding: []
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
        }
    }
});

export const { setArrCategory, setArrProject, setDetailProject } = projectReducer.actions

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
        await http.delete(`/api/Project/deleteProject?projectId=${id}`);
        const actionGetAllProject = getProjectAllAPI();
        dispatch(actionGetAllProject);
        show("success", 'Success', 'The project has deleted from list!!')
    }
}

export const updateProjectAPI = (id: number | string, data: any) => {
    return async (dispatch: DispatchType) => {
        await http.put(`/api/Project/updateProject?projectId=${id}`, data);
        const actionGetAllProject = getProjectAllAPI();
        dispatch(actionGetAllProject);
        swal({
            icon: "success",
            title: 'Successfully Update!!'
        });
    }
}


export const createProjectAPI = (value: ProjectCreate) => {
    return async (dispatch: DispatchType) => {
        await http.post(`/api/Project/createProjectAuthorize`, value);
        show('success', 'Successfully', 'Successfully Create Project')
    }
}


export const findingProjectAPI = (value: string) => {
    return async (dispatch: DispatchType) => {
        if (value !== "") {
            const result: any = await http.get(`/api/Project/getAllProject?keyword=${value}`);
            const arrProject: Project[] = result.data.content;
            const action: PayloadAction<Project[]> = setArrProject(arrProject);
            dispatch(action);
        }else {
            const result: any = await http.get('/api/Project/getAllProject');
            let arrProject: Project[] = result.data.content;
            const action: PayloadAction<Project[]> = setArrProject(arrProject);
            dispatch(action);
        }
    }
}


