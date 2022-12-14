import { Avatar, List, Modal } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { DispatchType, RootState } from '../../redux/configStore'
import { setVisible } from '../../redux/reducers/modalReducer'
import {  assignUserProjectInCreateProject, removeUserProjectAPIInCreatePost } from '../../redux/reducers/userReducer'

type Props = {}
export interface getUser {
    userId: number;
    name: string;
    avatar: string;
    email: string;
    phoneNumber: string;
}


export default function AdditionalUserListTask({ }: Props) {
    const { visible } = useSelector((state: RootState) => state.modalReducer);
    const { arrUser } = useSelector((state: RootState) => state.userReducer);
    const {  detailProject } = useSelector((state: RootState) => state.projectReducer);
    const [arrUsersFinding, setArrUsersFinding] = useState<getUser[]>([]);
    const dispatch: DispatchType = useDispatch();

    // Xử lý nghiệp vụ cho modal
    const handleCancel = () => {
        const action = setVisible(false);
        dispatch(action);
    }

    // Remove dấu khi search
    const removeVietnameseTones = (str: string) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
        str = str.replace(/\u02C6|\u0306|\u031B/g, "");
        str = str.replace(/ + /g, " ");
        str = str.trim();
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    }

    return (
        <div className='userList'>
            <Modal title="User List" open={visible} onCancel={handleCancel} width={800}>
                <div className="row">
                    <div className="col-7">
                        <h2>User Lists</h2>
                        <div className="form-group mb-3">
                            <p style={{ fontWeight: 700 }}>Find User</p>
                            <input type="text" className='form-control' placeholder='Enter the name you find' onChange={(e) => {
                                let value = removeVietnameseTones(e.target.value);
                                const arrFinding = arrUser.filter((user) => {
                                    if (removeVietnameseTones(user.name.toLowerCase()).search(value.toLowerCase()) != -1) {
                                        return user;
                                    }
                                })
                                setArrUsersFinding(arrFinding);
                            }} />
                        </div>
                        <div
                            id="scrollableDiv"
                            style={{
                                height: 400,
                                maxWidth: 500,
                                overflow: 'auto',
                                padding: '0 16px',
                                border: '1px solid rgba(140, 140, 140, 0.35)',
                            }}
                        >
                            <List
                                dataSource={arrUsersFinding.length >= 1 ? arrUsersFinding : arrUser}
                                renderItem={(item) => (
                                    <List.Item key={item.userId}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar} />}
                                            title={<p>{item.name}</p>}
                                            description={item.email}
                                        />
                                        <div>
                                            <button className='btn btn-primary' onClick={() => {
                                                const action = assignUserProjectInCreateProject(Number(detailProject?.id), item.userId)
                                                dispatch(action);
                                            }}>Add</button>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
                    <div className="col-5">
                        <h2>Projects</h2>
                        <p style={{ fontWeight: 700 }}>Project Name</p>
                        <input type="text" value={detailProject?.projectName} disabled className='form-control mb-3' />
                        <div
                            id="scrollableDiv"
                            style={{
                                height: 400,
                                maxWidth: 500,
                                overflow: 'auto',
                                padding: '0 16px',
                                border: '1px solid rgba(140, 140, 140, 0.35)',
                            }}
                        >
                            <List
                                dataSource={detailProject?.members}
                                renderItem={(item) => (
                                    <List.Item key={item.userId}>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar} />}
                                            title={<p>{item.name}</p>}
                                        />
                                        <div>
                                            <button className='btn btn-danger' onClick={() => {
                                                const action = removeUserProjectAPIInCreatePost(Number(detailProject?.id), item.userId)
                                                dispatch(action);
                                            }}>Remove</button>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}