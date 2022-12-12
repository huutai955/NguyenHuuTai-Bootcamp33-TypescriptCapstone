import { Menu } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { DispatchType } from '../../redux/configStore'
import { setVisibleEditTask } from '../../redux/reducers/modalReducer'
import { getAllPriorityAPI } from '../../redux/reducers/priorityReducer'
import { getProjectAllAPI } from '../../redux/reducers/projectReducer'
import { getAllStatusAPI } from '../../redux/reducers/statusReducer'
import { getAllTaskAPI } from '../../redux/reducers/taskReducer'
import { getAllUserAPI, setUserProfile } from '../../redux/reducers/userReducer'
import { settings } from '../../util/config'
import PopupMobile from '../Popup/PopupMobile'

type Props = {}

export default function HeaderMobile({ }: Props) {
  const dispatch: DispatchType = useDispatch();

  const [current, setCurrent] = useState('1');


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
    <div className='headerMobile'>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to={"/projects"}>
            <img width={50} src="./img/logoCyber.png" alt="" />
          </NavLink>
          <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <Menu
              theme={'dark'}
              style={{ width: '100%' }}
              defaultOpenKeys={['sub1']}
              selectedKeys={[current]}
              mode="inline"
              items={[
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
                    { label: <NavLink to={`/userinfor/${settings.getStorageJson('userProfile')?.id}`}>My Information</NavLink>, key: 'myinfor' },
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
          </div>
        </div>
      </nav>
      <PopupMobile />
    </div>
  )
}