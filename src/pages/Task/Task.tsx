import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DispatchType, RootState } from '../../redux/configStore'
import { getDetailProjectByIdAPI } from '../../redux/reducers/projectReducer'
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';


type Props = {}

export default function Task({ }: Props) {
    const { detailProject } = useSelector((state: RootState) => state.projectReducer);
    const dispatch: DispatchType = useDispatch()
    const params = useParams()

    useEffect(() => {
        const action = getDetailProjectByIdAPI(Number(params.id));
        dispatch(action);
    }, [])

    console.log(detailProject);

    const renderAvatar = () => {
        return detailProject?.members?.map((user, index) => {
            return <Tooltip title={user.name} key={index}>
                <Avatar style={{ backgroundColor: '#87d068' }} src={user.avatar} />
            </Tooltip>
        })
    }

    const renderTaskList = () => {
        return detailProject?.lstTask.map((task, index) => {
            return <div className="col-3">
                <div className="card">
                    <div className="card-header">
                        <h2>{task.statusName}</h2>
                    </div>
                </div>
            </div>
        })
    }
    return (
        <div className="task" style={{ paddingTop: 100 }}>
            <>
                <div className="task__members d-flex">
                    <h3 style={{ marginRight: 50 }}>Members</h3>
                    <div className="task__membersAvatar">
                        {renderAvatar()}
                    </div>
                </div>

                <div className="task__content">

                </div>
            </>
        </div>
    )
}