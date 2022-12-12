import { AppstoreOutlined, MailOutlined, MenuOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Menu, MenuProps, MenuTheme, Switch } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { DispatchType, RootState } from '../../redux/configStore'
import { setVisible, setVisibleEditTask, setVisibleTask } from '../../redux/reducers/modalReducer'
import { setUserProfile } from '../../redux/reducers/userReducer'
import { http, settings } from '../../util/config'
import Popup from '../Popup/Popup'

type Props = {}

export default function Header({ }: Props) {
    const dispatch: DispatchType = useDispatch();
    const openPopup = () => {
        const action = setVisibleEditTask(true);
        dispatch(action);
    }
    const [current, setCurrent] = useState('1');
    const userId = settings.getStorageJson("userProfile")?.id

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
                                    openPopup();
                                }}>Create Task</span>, key: 'createtask'
                            }
                        ]
                    },
                    {
                        label: 'User', key: 'user', children: [
                            { label: <NavLink to={"/users"}>User List</NavLink>, key: 'userlist' },
                            { label: <NavLink to={`/userinfor/${userId}`}>My Information</NavLink>, key: 'myinfor' },
                            { label: <span onClick={() => {
                                localStorage.removeItem('accessToken')
                                localStorage.removeItem('userProfile')
                                const action = setUserProfile(null);
                                dispatch(action);
                            }}>Logout</span>, key: 'logout' },
                        ]
                    },

                ]}
            />
            <Popup />
        </>
    )
}