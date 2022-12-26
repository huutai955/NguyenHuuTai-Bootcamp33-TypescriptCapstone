import React, { useEffect, useRef, useState } from 'react'
import { Space, Table, Tag, Avatar, Tooltip, Popconfirm, Button, Popover, AutoComplete } from 'antd';
import type { ColumnsType } from 'antd/es/table/interface';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { deleteProjectAPI, findingProjectAPI, getDetailProjectByIdAPI, getProjectAllAPI, Project } from '../../redux/reducers/projectReducer';
import { EditOutlined, DeleteOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons'
import EditProject from '../../components/EditProject/EditProject';
import swal from 'sweetalert';
import { assignUserProject, getUserAPI, removeUserProjectAPI } from '../../redux/reducers/userReducer';
import { setVisible } from '../../redux/reducers/modalReducer';
import { NavLink } from 'react-router-dom';
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

  // Xử lý nghiệp vụ tìm project
  const handleSearchProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const action  = findingProjectAPI(e.target.value);
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



  // Table content
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Project Name',
      render: (value, record): any => {
        return <NavLink to={`/task/${record.id}`}>{record.projectName}</NavLink>
      },
      sorter: (a, b) => a.projectName.length - b.projectName.length,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      responsive: ['lg'],
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      filters: [
        {
          text: 'Dự án web',
          value: 'Dự án web',
        },
        {
          text: 'Dự án phần mềm',
          value: 'Dự án phần mềm',
        },
        {
          text: 'Dự án di động',
          value: 'Dự án di động',
        },
      ],
      filterSearch: true,
      onFilter: (value, record): any => {
        return record.categoryName.startsWith(value.toString())
      }
    },
    {
      title: 'Creator',
      key: 'creator',
      responsive: ['lg'],
      render: (value, record, index): any => {
        return <Tag color='green' key={index}>{record.creator.name}</Tag>
      },
      sorter: (a, b) => a.creator.name.length - b.creator.name.length,
    },
    {
      title: 'Member',
      key: 'member',
      render: (value, record, index): any => {
        const renderTbodyEditUser = () => {
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
        const contentEditUser = (
          <table>
            <>
              <thead>
                <tr>
                  <th style={{ padding: 15 }}>ID</th>
                  <th style={{ padding: 15 }}>Avatar</th>
                  <th style={{ padding: 15 }}>Name</th>
                </tr>
              </thead>
              {renderTbodyEditUser()}
            </>
          </table >
        )
        return <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Render Avatar */}
          <Avatar.Group style={{ alignItems: 'center', marginRight: 5 }}
            maxCount={2}
            size="large"
          >{record.members.map((user, index): any => {
            return <Tooltip key={index} title={user.name} placement="top">
              <Avatar src={user.avatar} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            </Tooltip>
          })}
          </Avatar.Group>

          {/* Render edit user button */}
          {record.members.length >= 1 ? <Popover placement="bottom" title={'User List'} content={contentEditUser} trigger="click">
            <span style={{ color: '#1e88e5', fontSize: 20, cursor: 'pointer', marginRight: 8 }}><EditOutlined /></span>
          </Popover> : <></>}

          {/* Render add user button */}
          <Popover placement="bottom" title={'User List'} content={() => {
            return <AutoComplete style={{ width: '100%' }} onSearch={(value) => {
              if (searchRef.current) {
                clearTimeout(searchRef.current)
              }
              searchRef.current = setTimeout(() => {
                const action = getUserAPI(value);
                dispatch(action);
              }, 200)
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
            <span style={{ color: '#e53935', fontSize: 20, cursor: 'pointer', }}><UserAddOutlined /></span>
          </Popover>
        </div>
      }
    }
    ,
    {
      title: 'Action',
      key: 'action',
      render: (value, record): any => {
        return <Space>
          <span onClick={() => {
            showDrawer();
            getDetailProject(record.id);
          }}><EditOutlined style={{ fontSize: 20, cursor: 'pointer', color: '#1e88e5' }} /></span>
          <Popconfirm
            title="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              deleteProject(record.id);
            }}
          >
            <span><DeleteOutlined style={{ fontSize: 20, cursor: 'pointer', color: '#e53935' }} /></span>
          </Popconfirm>
        </Space>
      }
    },
  ];



  return (
    <div className="home" style={{ paddingTop: 70 }}>
      <div className='container'>
        <p style={{ fontWeight: 700 }}>Jira Project / <span style={{ color: '#e53935' }}>All Projects</span></p>
        <h2>Projects</h2>
        <input type="text" className='form-control mb-3' placeholder='Enter the project name you need to find!!' style={{ width: 350 }} onChange={(e) => {
          handleSearchProject(e)
        }} />
        <Table columns={columns} rowKey={"id"} dataSource={data} />
        
        <EditProject />
      </div >
    </div>
  )
}