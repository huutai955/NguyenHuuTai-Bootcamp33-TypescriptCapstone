import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { DispatchType, RootState } from '../../redux/configStore'
import { getAllUserAPI, getUser, getUserByIdAPI, removeUserAPI } from '../../redux/reducers/userReducer'
import { notification, Popconfirm, Popover, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { NotificationPlacement } from 'antd/lib/notification'
import 'antd-notifications-messages/lib/styles/style.css';
import { setVisibleEditUser } from '../../redux/reducers/modalReducer'
import EditUser from '../../components/EditUser/EditUser'
import { NavLink } from 'react-router-dom'
import { history, removeVietnameseTones, settings } from '../../util/config'
type Props = {}
type NotificationType = 'success' | 'info' | 'warning' | 'error';




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
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg']
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
          <span style={{ cursor: 'pointer', marginRight: 10 }}><EditOutlined onClick={() => {
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
            <span style={{ cursor: 'pointer', color: 'red' }}><DeleteOutlined /></span>
          </Popconfirm>
        </div>
      }
    }
  ];

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = removeVietnameseTones(e.target.value);
    const arrUserFingding = arrUser.filter((user) => {
      if (removeVietnameseTones(user.name.toLowerCase()).search(value.toLowerCase()) != -1) {
        return user;
      }
    })
    setArrUsersFinding(arrUserFingding);
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
    <div className='users'>
      <div className="container">
        <h2>User List</h2>
        <input type="text" className='form-control mb-3' style={{ width: 300 }} onChange={(e) => {
          handleSearchUser(e)
        }} />
        <Table columns={columns} dataSource={arrUsersFinding.length >= 1 ? arrUsersFinding : data} rowKey={'userId'} />
        <EditUser />
      </div>
    </div>
  )
}