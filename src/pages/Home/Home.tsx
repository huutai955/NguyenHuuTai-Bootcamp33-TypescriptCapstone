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
import { Formik } from 'formik';
import { NavLink } from 'react-router-dom';

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
  const [open, setOpen] = useState(false);
  const { arrProject } = useSelector((state: RootState) => state.projectReducer);
  const { arrGetUser } = useSelector((state: RootState) => state.userReducer);
  const { visible } = useSelector((state: RootState) => state.modalReducer);
  const [valueName, setValueName] = useState('');
  const dispatch: DispatchType = useDispatch();
  const data: DataType[] = arrProject;


  const searchRef: any = useRef(null);

  const showDrawer = () => {
    const action = setVisible(true);
    dispatch(action);
  }

  const getDetailProject = (id: number) => {
    const action = getDetailProjectByIdAPI(id);
    dispatch(action);
  }

  const deleteProject = (id: number) => {
    const action = deleteProjectAPI(id);
    dispatch(action);
  }

  useEffect(() => {
    swal({
      title: "Welcome to JiraProject!!!",
      icon: "success",
    });
    const action = getProjectAllAPI();
    dispatch(action);
  }, [])


  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Project Name',
      // dataIndex: 'projectName',
      // key: 'projectName',
      render: (value, record): any => {
        return <NavLink to={`/task/${record.id}`}>{record.projectName}</NavLink>
      },
      sorter: (a, b) => a.projectName.length - b.projectName.length,
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
    },
    {
      title: 'Creator',
      key: 'creator',
      render: (value, record, index): any => {
        return <Tag color='green' key={index}>{record.creator.name}</Tag>
      },
      sorter: (a, b) => a.creator.name.length - b.creator.name.length,

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
            <>
              <thead>
                <tr>
                  <th style={{ padding: 15 }}>ID</th>
                  <th style={{ padding: 15 }}>Avatar</th>
                  <th style={{ padding: 15 }}>Name</th>
                </tr>
              </thead>
              {renderTbody()}
            </>
          </table >
        )
        return <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar.Group style={{ alignItems: 'center', marginRight: 15 }}
            maxCount={2}
            size="large"
          >{record.members.map((user, index): any => {
            return <Tooltip key={index} title={user.name} placement="top">
              <Avatar src={user.avatar} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            </Tooltip>
          })}
          </Avatar.Group>
          {record.members.length >= 1 ? <Popover placement="bottom" title={'User List'} content={content} trigger="click">
            <Button ><a><EditOutlined style={{ fontSize: 20 }} /></a></Button>
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
            <Button style={{ marginLeft: 15 }}><a><UserAddOutlined /></a></Button>
          </Popover>
        </div>
      },

    }
    ,
    {
      title: 'Action',
      key: 'action',
      render: (value, record): any => {
        return <Space>
          <Button><a onClick={() => {
            showDrawer();
            getDetailProject(record.id);

          }}><EditOutlined style={{ fontSize: 20 }} /></a></Button>
          <Popconfirm
            title="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              deleteProject(record.id);
              swal({
                title: 'The Project Has Deleted From List!!',
                icon: "success",
              });
            }}
          >
            <Button><a><DeleteOutlined style={{ fontSize: 20 }} /></a></Button>
          </Popconfirm>
        </Space>
      }
    },
  ];



  return (
    <div className="home">
      <div className='container'>
        <Table columns={columns} rowKey={"id"} dataSource={data} />
        <EditProject />
      </div >
    </div>
  )
}