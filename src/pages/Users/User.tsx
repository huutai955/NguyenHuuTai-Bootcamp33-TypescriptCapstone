import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { DispatchType, RootState } from '../../redux/configStore'
import { findingUserAPI, getAllUserAPI, getUser, getUserByIdAPI, removeUserAPI } from '../../redux/reducers/userReducer'
import { notification, Popconfirm, Popover, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import 'antd-notifications-messages/lib/styles/style.css';
import { setVisibleEditUser } from '../../redux/reducers/modalReducer'
import EditUser from '../../components/EditUser/EditUser'
import { NavLink } from 'react-router-dom'
import { history, settings } from '../../util/config'
import '../../assests/scss/pages/_users.scss'
type Props = {}





export default function User({ }: Props) {
  const { arrUser } = useSelector((state: RootState) => state.userReducer)
  const { userProfile } = useSelector((state: RootState) => state.userReducer);
  const dispatch: DispatchType = useDispatch();
  const [arrUsersFinding, setArrUsersFinding] = useState<getUser[]>([]);
  const data: getUser[] = arrUser;

  const removeUserConfirmed = (userId: number) => {
    const action = removeUserAPI(userId);
    dispatch(action);
  }

  useEffect(() => {
    if (userProfile === null) {
      history.push("/")
    }
  }, [userProfile])

  const columns: ColumnsType<getUser> = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      sorter: (a, b) => Number(a.userId) - Number(b.userId)
    },
    {
      title: 'Name',
      render: (value, record): any => {
        return <NavLink to={`/userinfor/${record.userId}`}>{record.name}</NavLink>
      },
      sorter: (a, b) => a.name.length - b.name.length
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg'],
      sorter: (a, b) => a.email.length - b.email.length
    },
    {
      title: 'Phone Number',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      responsive: ['lg']
    },
    {
      title: 'Action',
      key: 'action',
      render: (value, record): any => {
        return <div>
          <span style={{ cursor: 'pointer', marginRight: 10, fontSize: 18, color: 'blue' }}><EditOutlined onClick={() => {
            const action = setVisibleEditUser(true);
            dispatch(action);
            const actionUser = getUserByIdAPI(record.userId);
            dispatch(actionUser);
          }} /></span>

          <Popconfirm
            placement="bottomRight"
            title={'Are you sure to delete this user?'}
            onConfirm={() => {
              removeUserConfirmed(record.userId);
            }}
            okText="Yes"
            cancelText="No"
          >
            <span style={{ cursor: 'pointer', color: 'red', fontSize: 18 }}><DeleteOutlined /></span>
          </Popconfirm>
        </div>
      }
    }
  ];

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const action = findingUserAPI(e.target.value)
    dispatch(action);
  }

  useEffect(() => {
    if (!settings.getStore("accessToken")) {
      history.push("/")
    } else {
      const action = getAllUserAPI();
      dispatch(action);
    }
  }, [])
  return (
    <div className='users' style={{padding: 70}}>
      <div className="container">
        <p style={{ fontWeight: 700 }}>Jira Project / <span style={{ color: '#e53935' }}>User List</span></p>
        <h2>User List</h2>
        <input type="text" className='form-control mb-3' placeholder='Enter the name you need to find!!' style={{ width: 300 }} onChange={(e) => {
          handleSearchUser(e)
        }} />
        <Table columns={columns} dataSource={data} rowKey={'userId'} />
        <EditUser />
      </div>
    </div>
  )
}