import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { http, show } from '../../util/config';
import { DispatchType } from '../configStore';
import { setVisibleEditTask } from './modalReducer';
import { getDetailProjectByIdAPI } from './projectReducer';

export interface Task {
    id: number;
    taskType: string;
}

export interface TaskDetail {
    priorityTask: PriorityTask;
    taskTypeDetail: TaskTypeDetail;
    assigness: Assigness[];
    lstComment: any[];
    taskId: number;
    taskName: string;
    alias: string;
    description: string;
    statusId: string;
    originalEstimate: number;
    timeTrackingSpent: number;
    timeTrackingRemaining: number;
    typeId: number;
    priorityId: number;
    projectId: number;
    listUserAsign: []
}

export interface Assigness {
    id: number;
    avatar: string;
    name: string;
    alias: string;
}

export interface PriorityTask {
    priorityId: number;
    priority: string;
}

export interface TaskTypeDetail {
    id: number;
    taskType: string;
}

interface TaskState {
    arrTask: Task[],
    messageCreateTask: string,
    taskDetail: TaskDetail | undefined | null,
    messageUpdateTask: string
    messageDeleteTask: string
}


const initialState: TaskState = {
    arrTask: [],
    messageCreateTask: '',
    taskDetail: undefined,
    messageUpdateTask: '',
    messageDeleteTask: ''
}

const taskReducer = createSlice({
    name: 'taskReducer',
    initialState,
    reducers: {
        setArrTask: (state: TaskState, action: PayloadAction<Task[]>) => {
            const arrTask: Task[] = action.payload;
            state.arrTask = arrTask;
        },
        setTaskDetail: (state: TaskState, action: PayloadAction<TaskDetail>) => {
            const taskDetail: TaskDetail = action.payload;
            state.taskDetail = taskDetail;
        },
        setAssigness: (state: TaskState, action: PayloadAction<Assigness>) => {
            let Assigness: Assigness = action.payload;
            state.taskDetail?.assigness.push(Assigness);
        },
        setMessageUpdateTask: (state: TaskState, action: PayloadAction<string>) => {
            const message: string = action.payload;
            state.messageUpdateTask = message;
        }
    }
});

export const { setMessageUpdateTask, setAssigness, setTaskDetail, setArrTask } = taskReducer.actions

export default taskReducer.reducer

export const getAllTaskAPI = () => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.get('/api/TaskType/getAll');
        const arrPriority: Task[] = result.data.content;
        const action: PayloadAction<Task[]> = setArrTask(arrPriority);
        dispatch(action);
    }
}

export const createTaskAPI = (value: any) => {
    return async (dispatch: DispatchType) => {
        try {
            await http.post('/api/Project/createTask', value);
            const actionHideTask = setVisibleEditTask(false)
            dispatch(actionHideTask)
            show("success", 'Success', 'Successfully create task!!')
        } catch (err: any) {
            if (err.response.data.content === 'task already exists!') {
                show("error", 'Error', 'Task has already existed!!')
            }else if (err.response.data.content === 'User is unthorization!') {
                show("error", 'Error', `You are not project's creator!!`)
            }
        }
    }
}

export const getTaskDetailAPI = (value: number) => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.get(`/api/Project/getTaskDetail?taskId=${value}`);
        const taskDetail: TaskDetail = result.data.content;
        const action: PayloadAction<TaskDetail> = setTaskDetail(taskDetail);
        dispatch(action);
    }
}


export const updateStatusAPI = (value: any, id: number) => {
    return async (dispatch: DispatchType) => {
        await http.put('/api/Project/updateStatus', value);
        const actionDetailProject = getDetailProjectByIdAPI(id)
        dispatch(actionDetailProject);
    }
}



export const updateTaskDetailAPI = (value: any, id: number, taskDetailID: number) => {
    return async (dispatch: DispatchType) => {
        try {
            await http.post('/api/Project/updateTask', value);
            const actionDetailProject = getDetailProjectByIdAPI(id)
            await dispatch(actionDetailProject);
            const actionTaskDetail = getTaskDetailAPI(taskDetailID)
            dispatch(actionTaskDetail);
        } catch (err: any) {
            // Fixing here later
            console.log(err)
        }
    }
}

export const deleteTaskAPI = (taskID: number, id: number) => {
    return async (dispatch: DispatchType) => {
        const result: any = await http.delete(`/api/Project/removeTask?taskId=${taskID}`);
        const message: string = result.data.message;
        const action: PayloadAction<string> = setMessageUpdateTask(message);
        await dispatch(action);
        const actionDetailProject = getDetailProjectByIdAPI(id)
        dispatch(actionDetailProject);
    }
}










