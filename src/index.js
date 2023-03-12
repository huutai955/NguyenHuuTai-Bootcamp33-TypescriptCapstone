import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import FirstTemplates from './templates/FirstTemplates/FirstTemplates';
import SecondTemplates from './templates/SecondTemplates/SecondTemplates';
import './index.scss'
import { Provider } from 'react-redux';
import { store } from './redux/configStore'
import ThirdTemplates from './templates/ThirdTemplates/ThirdTemplates';
import 'antd/dist/antd.min.css';
import Project from './pages/Project/Project';
import { history } from './util/config';
import Task from './pages/Task/Task';
import ResponsiveItem from './components/ResponsiveItem/ResponsiveItem';
import FirstTemplatesMobile from './templates/FirstTemplates/FirstTemplatesMobile'
import HomeMobile from './pages/Home/HomeMobile'
import User from './pages/Users/User';
import UserInfor from './pages/UserInfor/UserInfor';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Provider store={store}>
    <HistoryRouter history={history}>
      <Routes>
        <Route path='' element={<ResponsiveItem component={FirstTemplates} mobileComponent={FirstTemplatesMobile} />}>
          <Route path='/projects' element={<ResponsiveItem component={Home} mobileComponent={HomeMobile} />} />
          <Route path='/createproject' element={<Project />} />
          <Route path="/task">
            <Route path=':id' element={<Task />} />
          </Route>
          <Route path='users' element={<User />} />
          <Route path='userinfor' >
            <Route path=':id' element={<UserInfor />} />
          </Route>
        </Route>
        <Route path='' element={<SecondTemplates />}>
          <Route index element={<Login />} />
        </Route>

        <Route path='' element={<ThirdTemplates />}>
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
    </HistoryRouter>
  </Provider>
);


React.createElement()