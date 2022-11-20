import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route,  unstable_HistoryRouter as HistoryRouter} from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import FirstTemplates from './templates/FirstTemplates/FirstTemplates';
import SecondTemplates from './templates/SecondTemplates/SecondTemplates';
import './index.scss'
import { Provider } from 'react-redux';
import {store} from './redux/configStore'
import ThirdTemplates from './templates/ThirdTemplates/ThirdTemplates';
import App from './pages/Demo/App';
import 'antd/dist/antd.min.css';
import Project from './pages/Project/Project';
import { history } from './util/config';
import Task from './pages/Task/Task';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <Provider store={store}>
    <HistoryRouter  history={history}>
      <Routes>
        <Route path='' element={<FirstTemplates />}>
          <Route index element={<Home />} />
          <Route path='/app' element={<App />} />
          <Route path='/createproject' element={<Project />} />
          <Route path="/task">
              <Route path=':id' element={<Task />}/>
          </Route>
        </Route>
        <Route path='' element={<SecondTemplates />}>
          <Route path='login' element={<Login />} />
        </Route>

        <Route path='' element={<ThirdTemplates />}>
          <Route path='register' element={<Register />} />
        </Route> 
      </Routes>
    </HistoryRouter>
  </Provider>
);
