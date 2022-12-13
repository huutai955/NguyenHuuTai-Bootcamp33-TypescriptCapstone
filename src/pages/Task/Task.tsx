import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DispatchType, RootState } from '../../redux/configStore'
import { getDetailProjectByIdAPI } from '../../redux/reducers/projectReducer'
import { Avatar, Tooltip } from 'antd';
import TaskContent from '../../components/TaskContent/TaskContent'
import DetailTask from '../../components/DetailTask/DetailTask'
import '../../assests/scss/pages/_task.scss'
import { setVisible } from '../../redux/reducers/modalReducer'
import { history, settings } from '../../util/config'
import { getAllUserAPI } from '../../redux/reducers/userReducer'
import AdditionalUserListTask from '../../components/UserModal/AdditionalUserListTask'

type Props = {}


export default function Task({ }: Props) {
    const { detailProject } = useSelector((state: RootState) => state.projectReducer);
    const { userProfile } = useSelector((state: RootState) => state.userReducer);
    const dispatch: DispatchType = useDispatch()
    const params = useParams()
    useEffect(() => {
        if (!settings.getStore("accessToken")) {
            history.push("/")
        } else {
            const action = getDetailProjectByIdAPI(Number(params.id));
            dispatch(action);
        }
    }, [])

    useEffect(() => {
        if (userProfile === null) {
            history.push("/")
        }
    }, [userProfile])
    return (
        <div className="task" style={{ paddingTop: 100 }}>
            <div className='container'>
                <h2>Task Detail: {detailProject?.projectName}</h2>
                <div className="task__members d-flex mb-3" style={{justifyContent: 'space-between'}}>
                    <h3 style={{ marginRight: 50, marginBottom: 0 }}>Members</h3>
                    <div className="task__membersAvatar d-flex" style={{ alignItems: 'center' }}>
                        <Avatar.Group maxCount={3}>
                            {detailProject?.members?.map((user, index) => {
                                return <Tooltip title={user.name} key={index}>
                                    <Avatar style={{ backgroundColor: '#87d068' }} src={user.avatar} />
                                </Tooltip>
                            })}
                        </Avatar.Group>
                        <span style={{ fontSize: 20, padding: '0 11px', marginLeft: 10, borderRadius: '50%', cursor: 'pointer', backgroundColor: '#ccc' }} onClick={() => {
                            const action = setVisible(true);
                            dispatch(action);
                            const actionUsers = getAllUserAPI();
                            dispatch(actionUsers);
                        }}>+</span>
                    </div>
                </div>
                <div className="task__content">
                    <TaskContent />
                </div>
                <AdditionalUserListTask />
                <DetailTask />
            </div>
        </div>
    )
}