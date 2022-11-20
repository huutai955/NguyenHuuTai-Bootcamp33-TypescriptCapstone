import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

type Props = {}

export default function FirstTemplates({ }: Props) {
  return (
    <>
      {/* <div className='header'>
        <div className="container">
          <div className="header__first">
            <img src="./img/logo.png" alt="" />
          </div>
          <div className="header__second">
            <ul>
              <li className='header__project'><NavLink to={"/createproject"}>Project</NavLink>
                <ul>
                  <li><NavLink to="">Project List</NavLink></li>
                  <li><NavLink to="/createproject">Create Project</NavLink></li>
                </ul>
              </li>
              <li><NavLink to={""}>Task</NavLink></li>
              <li><NavLink to={""}>Profile</NavLink></li>
            </ul>
          </div>
        </div>
      </div> */}

      <div className="row w-100 m-0">
        <div className="col-2 p-0">
          <div className="menu">
            <div className="row">
              <div className="col-2">
                <img src="./img/logo.png" alt="" />
                <i className="fa-solid fa-user" onClick={() => {
                  let user = document.querySelector("#dashboardUser");
                  let task = document.querySelector("#dashboardTask");
                  let project = document.querySelector("#dashboardProject");
                  if (user?.classList.contains('showDasboard')) {
                    user?.classList.remove('showDasboard')
                  } else {
                    user?.classList.add('showDasboard')
                    task?.classList.remove('showDasboard')
                    project?.classList.remove('showDasboard')
                  }
                }}></i>
                <i className="fa-brands fa-r-project" onClick={() => {
                  let project = document.querySelector("#dashboardProject");
                  let user = document.querySelector("#dashboardUser");
                  let task = document.querySelector("#dashboardTask");
                  if (project?.classList.contains('showDasboard')) {
                    project?.classList.remove('showDasboard')
                  } else {
                    project?.classList.add('showDasboard')
                    user?.classList.remove('showDasboard')
                    task?.classList.remove('showDasboard')
                  }
                }}></i>
                <i className="fa-solid fa-list-check" onClick={() => {
                  let task = document.querySelector("#dashboardTask");
                  let project = document.querySelector("#dashboardProject");
                  let user = document.querySelector("#dashboardUser");
                  if (task?.classList.contains('showDasboard')) {
                    task?.classList.remove('showDasboard')
                  } else {

                    task?.classList.add('showDasboard')
                    user?.classList.remove('showDasboard')
                    project?.classList.remove('showDasboard')
                  }
                }}></i>
              </div>
              <div className="col-10" id='dashboardUser'>
                <h3>Dashboard User</h3>
              </div>
              <div className="col-10" id='dashboardProject'>
                <h3>Dashboard Project</h3>
              </div>
              <div className="col-10" id='dashboardTask'>
                <h3>Dashboard Task</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-10">
          <Outlet />
        </div>
      </div>



    </>
  )
}