import React, { useEffect, useRef, useState } from 'react'
import { Space, Table, Tag, Avatar, Tooltip, Popconfirm, Button, Popover, AutoComplete } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { deleteProjectAPI, getDetailProjectByIdAPI, getProjectAllAPI } from '../../redux/reducers/projectReducer';
import { EditOutlined, DeleteOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons'
import EditProject from '../../components/EditProject/EditProject';
import swal from 'sweetalert';
import { assignUserProject, getUserAPI, removeUserProjectAPI } from '../../redux/reducers/userReducer';
import { setVisible } from '../../redux/reducers/modalReducer';
import { NavLink } from 'react-router-dom';
import '../../assests/scss/pages/_homemobile.scss';
import EditProjectMobile from '../../components/EditProject/EditProjectMobile';
import { history, settings } from '../../util/config';

type Props = {}
interface DataType {
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


export default function Home({ }: Props) {
  const { arrProject } = useSelector((state: RootState) => state.projectReducer);
  const { arrGetUser, userProfile } = useSelector((state: RootState) => state.userReducer);
  const [valueName, setValueName] = useState('');
  const dispatch: DispatchType = useDispatch();
  const data: DataType[] = arrProject;


  const searchRef: any = useRef(null);

  // Xử lý nghiệp vụ cho Editproject
  const showDrawer = () => {
    const action = setVisible(true);
    dispatch(action);
  }

  // Xử lý nghiệp vụ cho Editproject
  const getDetailProject = (id: number) => {
    const action = getDetailProjectByIdAPI(id);
    dispatch(action);
  }
  // Xử lý nghiệp vụ cho button delete
  const deleteProject = (id: number) => {
    const action = deleteProjectAPI(id);
    dispatch(action);
  }

  useEffect(() => {
    if (!settings.getStore("accessToken")) {
      history.push("/")
    } else {
      swal({
        title: "Welcome to JiraProject!!!",
        icon: "success",
      });
      const action = getProjectAllAPI();
      dispatch(action);
    }
  }, [])

  useEffect(() => {
    if (userProfile === null) {
      history.push("/")
    }
  }, [userProfile])


  const columns: ColumnsType<DataType> = [
    {
      title: 'Project Name',
      render: (value, record): any => {
        return <NavLink to={`/task/${record.id}`}>{record.projectName}</NavLink>
      },
      sorter: (a, b) => a.projectName.length - b.projectName.length,
    },
    {
      title: 'Member',
      render: (value, record, index): any => {
        const renderTbody = () => {
          return record.members.map((member, index) => {
            return <tbody key={index}>
              <tr>
                <td style={{ padding: 15 }}>{member.userId}</td>
                <td style={{ padding: 15 }}>
                  <Tooltip key={index} title={member.name} placement="top">
                    <Avatar src={member.avatar} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                  </Tooltip>
                </td>
                <td style={{ padding: 15 }}>{member.name}</td>
                <td style={{ padding: 15 }}><a onClick={() => {
                  const action = removeUserProjectAPI(record.id, member.userId)
                  dispatch(action);
                }}><DeleteOutlined style={{ fontSize: 20 }} /></a></td>
              </tr>
            </tbody>
          })
        }
        const content = (
          <table>
            <thead>
              <tr>
                <th style={{ padding: 15 }}>ID</th>
                <th style={{ padding: 15 }}>Avatar</th>
                <th style={{ padding: 15 }}>Name</th>
              </tr>
            </thead>
            {renderTbody()}
          </table >
        )
        return <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar.Group style={{ alignItems: 'center', marginRight: 5 }}
            maxCount={2}
            size="large"
          >{record.members.map((user, index): any => {
            return <Tooltip key={index} title={user.name} placement="top">
              <Avatar src={user.avatar} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            </Tooltip>
          })}
          </Avatar.Group>
          {record.members.length >= 1 ? <Popover placement="bottom" title={'User List'} content={content} trigger="click">
            <span><EditOutlined  style={{ fontSize: 15, color: '#1e88e5' }} /></span>
          </Popover> : ''}
          <Popover placement="bottom" title={'User List'} content={() => {
            return <AutoComplete style={{ width: '100%' }} onSearch={(value) => {
              if (searchRef.current) {
                clearTimeout(searchRef.current)
              }
              searchRef.current = setTimeout(() => {
                const action = getUserAPI(value);
                dispatch(action);
              }, 500)
            }}
              options={arrGetUser?.map((user) => {
                return { label: user.name, value: user.userId.toString() }
              })}
              value={valueName}
              onSelect={(value: string, option: any) => {
                setValueName(option.label)
                const action = assignUserProject(record.id, option.value)
                dispatch(action);
              }}
              onChange={(text) => {
                setValueName(text)
              }}
            />
          }} trigger="click">
            <span style={{ fontSize: 15, color: '#e53935' }}><UserAddOutlined /></span>
          </Popover>
        </div>
      },

    },
    {
      title: 'Action',
      key: 'action',
      render: (value, record): any => {
        return <div className='text-center'>
          <span onClick={() => {
            showDrawer();
            getDetailProject(record.id);
          }}><EditOutlined style={{ fontSize: 15, color: '#1e88e5' }} /></span>
          <Popconfirm
            title="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              deleteProject(record.id);
            }}
          >
            <span><DeleteOutlined style={{ fontSize: 15, color: '#e53935' }} /></span>
          </Popconfirm>
        </div>
      }
    },
  ];



  return (
    <div className="homeMobile">
      <div className='container'>
        <Table columns={columns} style={{ padding: 0 }} rowKey={"id"} dataSource={data} />
        <EditProjectMobile />
      </div >
    </div>
  )
}