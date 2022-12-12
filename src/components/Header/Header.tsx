import { AppstoreOutlined, MailOutlined, MenuOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Menu, MenuProps, MenuTheme, Switch } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { DispatchType } from '../../redux/configStore'
import {  setVisibleEditTask } from '../../redux/reducers/modalReducer'
import { getAllPriorityAPI } from '../../redux/reducers/priorityReducer'
import { getProjectAllAPI } from '../../redux/reducers/projectReducer'
import { getAllStatusAPI } from '../../redux/reducers/statusReducer'
import { getAllTaskAPI } from '../../redux/reducers/taskReducer'
import { getAllUserAPI, setUserProfile } from '../../redux/reducers/userReducer'
import { settings } from '../../util/config'
import Popup from '../Popup/Popup'

type Props = {}

export default function Header({ }: Props) {
    const dispatch: DispatchType = useDispatch();
    const [current, setCurrent] = useState('1');
    const userId = settings.getStorageJson("userProfile")?.id

    // Xử lý nghiệp vụ gọi api khi click vào create task
    const callAPICreateTask = () => {
        const action = getProjectAllAPI();
        dispatch(action)
        const actionPriority = getAllPriorityAPI();
        dispatch(actionPriority)
        const actionTask = getAllTaskAPI();
        dispatch(actionTask)
        const actionStatus = getAllStatusAPI();
        dispatch(actionStatus);
        const actionUser = getAllUserAPI()
        dispatch(actionUser);
    }

    // Xử lý nghiệp vụ mở popup khi click vào create task
    const openPopup = () => {
        const action = setVisibleEditTask(true);
        dispatch(action);
    }
    return (
        <>
            <Menu
                theme={'dark'}
                style={{ height: '100vh' }}
                defaultOpenKeys={['sub1']}
                selectedKeys={[current]}
                mode="inline"
                items={[
                    {
                        label: <div className='logo d-flex'>
                            <img width={50} height={50} src="./img/logoCyber.png" alt="" />
                            <div className='logo__text'>
                                <h2 style={{ color: '#ffffff', margin: 0 }}>Cyber Soft</h2>
                                <span>Jira Project</span>
                            </div>
                        </div>, key: 'logo', className: 'imgLabel'
                    },
                    {
                        label: <span>Project</span>, key: 'home', children: [
                            { label: <NavLink to={"/projects"}>View All Projects</NavLink>, key: 'viewAllProjects' },
                            { label: <NavLink to={"/createproject"}>Create Project</NavLink>, key: 'createProject' },
                        ]
                    },
                    {
                        label: 'Task', key: 'task', children: [
                            {
                                label: <span onClick={() => {
                                    callAPICreateTask();
                                    openPopup();
                                }}>Create Task</span>, key: 'createtask'
                            }
                        ]
                    },
                    {
                        label: 'User', key: 'user', children: [
                            { label: <NavLink to={"/users"}>User List</NavLink>, key: 'userlist' },
                            { label: <NavLink to={`/userinfor/${userId}`}>My Information</NavLink>, key: 'myinfor' },
                            {
                                label: <span onClick={() => {
                                    localStorage.removeItem('accessToken')
                                    localStorage.removeItem('userProfile')
                                    const action = setUserProfile(null);
                                    dispatch(action);
                                }}>Logout</span>, key: 'logout'
                            },
                        ]
                    },

                ]}
            />
            <Popup />
        </>
    )
}