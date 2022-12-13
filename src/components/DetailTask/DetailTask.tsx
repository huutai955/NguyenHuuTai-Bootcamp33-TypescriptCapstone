import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DispatchType, RootState } from '../../redux/configStore'
import parse from 'html-react-parser'
import { Modal, Select, Collapse, InputNumber, Tooltip, Avatar, Input, Popconfirm } from 'antd'
import { Editor } from '@tinymce/tinymce-react'
import { setVisibleTask } from '../../redux/reducers/modalReducer'
import { deleteTaskAPI, updateTaskDetailAPI } from '../../redux/reducers/taskReducer'
import { addCommentAPI, commentContent, deleteCommentAPI, getAllCommentAPI, updateCommentAPI } from '../../redux/reducers/commentReducer'
import '../../assests/scss/components/_detailtask.scss'
const { Panel } = Collapse;
const { Option } = Select;
type Props = {}

export default function DetailTask({ }: Props) {
    const { taskDetail, arrTask } = useSelector((state: RootState) => state.taskReducer)
    const { detailProject } = useSelector((state: RootState) => state.projectReducer)
    const { arrStatus } = useSelector((state: RootState) => state.statusReducer)
    const { arrPriority } = useSelector((state: RootState) => state.priorityReducer)
    const { visibleTask } = useSelector((state: RootState) => state.modalReducer)
    const { userProfile } = useSelector((state: RootState) => state.userReducer)
    const { arrComment } = useSelector((state: RootState) => state.commentReducer)
    const dispatch: DispatchType = useDispatch();
    const [commentContent, setCommentContent] = useState<string>("");
    const [visibleEditor, setVisibleEditor] = useState(false)
    const [defaultValueUpdate, setDefaultValueUpdate] = useState({
        listUserAsign: taskDetail?.assigness.map((assignes) => {
            return assignes.id
        }),
        taskId: taskDetail?.taskId,
        taskName: taskDetail?.taskName,
        description: taskDetail?.description,
        statusId: taskDetail?.statusId,
        originalEstimate: taskDetail?.originalEstimate,
        timeTrackingSpent: taskDetail?.timeTrackingSpent,
        timeTrackingRemaining: taskDetail?.timeTrackingRemaining,
        projectId: taskDetail?.projectId,
        typeId: taskDetail?.typeId,
        priorityId: taskDetail?.priorityId
    })
    const [editComment, setEditComment] = useState("");
    const [textDescription, setTextDescription] = useState<string | undefined>(taskDetail?.description);
    const searchRef: any = useRef(null);


    const renderTimeTracking = () => {
        const max = Number(defaultValueUpdate.timeTrackingSpent) + Number(defaultValueUpdate.timeTrackingRemaining)
        const percent = Math.round(Number(defaultValueUpdate.timeTrackingSpent) / max * 100)
        return <div className="w-100" style={{ marginTop: 2 }}>
            < div className="progress" style={{ height: 8 }}>
                <div className="progress-bar" role="progessbar" style={{ width: `${percent}%` }} aria-valuenow={Number(defaultValueUpdate.timeTrackingSpent)}
                    aria-valuemin={Number(defaultValueUpdate.timeTrackingRemaining)} aria-valuemax={max}
                />
            </div >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p>{Number(defaultValueUpdate.timeTrackingSpent)}h logged</p>
                <p>{Number(defaultValueUpdate.timeTrackingRemaining)}h remaining</p>
            </div>
        </div >
    }

    const renderDescription = () => {
        const newString: any = taskDetail?.description
        const jsxDescription = parse(newString || '')
        return <div className='description__content'>
            {
                visibleEditor ? <div>
                    <Editor
                        tagName='description'
                        initialValue={taskDetail?.description || ''}
                        onEditorChange={(newText: string) => {
                            setTextDescription(newText)
                        }}
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                                'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                                'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                                'alignleft aligncenter alignright alignjustify | ' +
                                'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                    <button className='btn btn-primary mt-3' onClick={() => {
                        setVisibleEditor(false)
                        const valueUpdate = {
                            ...defaultValueUpdate,
                            description: textDescription
                        }
                        const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                        dispatch(action);
                    }}>Save</button>
                    <button className='btn btn-primary mt-3 btnClose' onClick={() => {
                        setVisibleEditor(false)
                    }}>Close</button>
                </div> : <div onClick={() => {
                    setVisibleEditor(true)
                }}>
                    <span>{jsxDescription}</span>
                </div>
            }
        </div>
    }


    // Xử lý nghiệp vụ cho phần description
    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value: commentContent = {
            taskId: Number(taskDetail?.taskId),
            contentComment: commentContent
        }
        const action = addCommentAPI(value, Number(taskDetail?.taskId));
        dispatch(action);
    }

    // // Xử lý nghiệp vụ cho phần PopConfirm của antd
    const deleteConfirm = () => {
        const action = deleteTaskAPI(Number(taskDetail?.taskId), Number(taskDetail?.projectId));
        dispatch(action);
        const actionHideTask = setVisibleTask(false)
        dispatch(actionHideTask);
    }



    useEffect(() => {
        setDefaultValueUpdate({
            listUserAsign: taskDetail?.assigness.map((assignes) => {
                return assignes.id
            }),
            taskId: taskDetail?.taskId,
            taskName: taskDetail?.taskName,
            description: taskDetail?.description,
            statusId: taskDetail?.statusId,
            originalEstimate: taskDetail?.originalEstimate,
            timeTrackingSpent: taskDetail?.timeTrackingSpent,
            timeTrackingRemaining: taskDetail?.timeTrackingRemaining,
            projectId: taskDetail?.projectId,
            typeId: taskDetail?.typeId,
            priorityId: taskDetail?.priorityId
        })
    }, [taskDetail])

    return (
        <div className='detailtask'>
            <Modal
                title={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="task-title d-flex" style={{ alignItems: 'center' }}>
                        <i className='fa fa-bookmark' style={{ marginRight: 10 }} />
                        <select className='form-control' value={taskDetail?.typeId || ''} onChange={(e) => {
                            const valueUpdate = {
                                ...defaultValueUpdate,
                                typeId: e.target.value
                            }
                            const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                            dispatch(action);
                        }}>
                            {arrTask.map((task, index) => {
                                return <option key={index} value={task.id}>{task.taskType}</option>
                            })}
                        </select>
                    </div>
                    <div className="d-flex" style={{ marginRight: 20 }}>
                        <Popconfirm placement="bottom" title={'Are you sure to delete this task?'} onConfirm={deleteConfirm} okText="Yes" cancelText="No">
                            <span style={{ lineHeight: '29px' }}>Delete Task</span>
                        </Popconfirm>
                    </div>
                </div>}
                centered
                open={visibleTask}
                onCancel={() => {
                    const action = setVisibleTask(false);
                    dispatch(action)
                }}
                width={1000}
            >
                <div className="row detailtask__row">
                    <div className="col-7">
                        <div className="issue">This is an issue of type: {taskDetail?.taskTypeDetail.taskType}.</div>
                        <div className="description">
                            <p style={{ fontWeight: 700 }}>Description</p>
                            {renderDescription()}
                        </div>
                        <div className="comment mt-4">
                            <div className="row">
                                <div className="col-1 p-0">
                                    <Tooltip title={userProfile?.name}>
                                        <Avatar style={{ backgroundColor: '#87d068' }} src={userProfile?.avatar} />
                                    </Tooltip>
                                </div>
                                <div className="col-11 p-0">
                                    <form onSubmit={handleSubmit}>
                                        <div>
                                            <Editor
                                                tagName='description'
                                                onEditorChange={(newText: string) => {
                                                    setCommentContent(newText)
                                                }}
                                                init={{
                                                    height: 170,
                                                    menubar: false,
                                                    plugins: [
                                                        'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                                                        'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                                                        'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                                    ],
                                                    toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                                                        'alignleft aligncenter alignright alignjustify | ' +
                                                        'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
                                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                                }}
                                            />
                                        </div>
                                        <div className="form-group mt-4" style={{ textAlign: 'right' }}>
                                            <button className='btn btn-primary'>Comment</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="comment__content">
                                {arrComment?.map((comment, index) => {
                                    return <div className="row mb-3" key={index}>
                                        <div className="col-1 p-0">
                                            <Avatar style={{ backgroundColor: '#87d068' }} src={userProfile?.avatar} />
                                        </div>
                                        <div className="col-11 p-0">
                                            <span><strong>{comment.user.name}</strong></span>
                                            {editComment === comment.id.toString() ?
                                                <Editor
                                                    tagName='description'
                                                    initialValue={comment.contentComment}
                                                    onEditorChange={(newText: string) => {
                                                        setCommentContent(newText)
                                                    }}
                                                    init={{
                                                        height: 170,
                                                        menubar: false,
                                                        plugins: [
                                                            'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                                                            'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                                                            'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                                        ],
                                                        toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                                                            'alignleft aligncenter alignright alignjustify | ' +
                                                            'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
                                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                                    }}
                                                />
                                                : <p>{parse(comment.contentComment)}</p>}
                                            {editComment === comment.id.toString() ?
                                                <div className="comment__button">
                                                    <span style={{ marginRight: 10 }} onClick={() => {
                                                        setEditComment("")
                                                        const action = updateCommentAPI(comment.id, commentContent, comment.taskId)
                                                        dispatch(action);
                                                    }}>Save</span>
                                                    <span onClick={() => {
                                                        setEditComment("")
                                                    }}>Cancel</span>
                                                </div>
                                                :
                                                <div className="comment__button">
                                                    <span style={{ marginRight: 10 }} onClick={() => {
                                                        setEditComment(comment.id.toString())
                                                    }}>Edit</span>
                                                    <span onClick={() => {
                                                        const action = deleteCommentAPI(comment.id, comment.taskId)
                                                        dispatch(action);
                                                    }}>Delete</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="col-5">
                        <Select
                            style={{ width: 150, marginBottom: 10 }}
                            value={defaultValueUpdate.statusId}
                            onChange={(value) => {
                                const valueUpdate = {
                                    ...defaultValueUpdate,
                                    statusId: value
                                }
                                const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                dispatch(action);
                            }}
                            options={arrStatus.map((status, index) => {
                                return {
                                    value: status.statusId,
                                    label: status.statusName
                                }
                            })}
                        />
                        <Collapse accordion>
                            <Panel header="This is panel header 1" key={1}>
                                <div className="assignees d-flex" style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <p style={{ minWidth: 65 }}>Assignees</p>
                                    <Select
                                        mode="multiple"
                                        value={defaultValueUpdate.listUserAsign}
                                        style={{ width: '100%', marginLeft: 20 }}
                                        onChange={(value, option) => {
                                            const listUser = option.map((user: any) => {
                                                return user.value
                                            })
                                            const valueUpdate = {
                                                ...defaultValueUpdate,
                                                listUserAsign: listUser
                                            }
                                            const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                            dispatch(action);
                                        }}
                                    >
                                        {detailProject?.members.map((user, index) => {
                                            return <Option value={user.userId} label={user.name} key={index}>
                                                <div className="demo-option-label-item">
                                                    {user.name}
                                                </div>
                                            </Option>
                                        })}
                                    </Select>
                                </div>
                                <div className="priority d-flex" style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <p style={{ minWidth: 65 }}>Priority</p>
                                    <Select
                                        placeholder="select priority"
                                        style={{ width: 120, marginLeft: 20 }}
                                        value={defaultValueUpdate.priorityId}
                                        onChange={(value) => {
                                            const valueUpdate = {
                                                ...defaultValueUpdate,
                                                priorityId: value
                                            }
                                            const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                            dispatch(action);
                                        }}
                                        options={arrPriority.map((priority, index) => {
                                            return {
                                                value: priority.priorityId,
                                                label: priority.priority
                                            }
                                        })}
                                    />
                                </div>
                                <div className="estimate d-flex" style={{ alignItems: 'center', marginBottom: 10 }}>
                                    <p style={{ minWidth: 65 }}>Estimate</p>
                                    <InputNumber min={0} style={{ width: '100%', marginLeft: 20 }} onChange={(value) => {
                                        if (searchRef.current) {
                                            clearTimeout(searchRef.current)
                                        }
                                        searchRef.current = setTimeout(() => {
                                            // Bắt trường hợp khi user xóa hết số trong input thì giá trị sẽ trả về 0 để không bị lỗi khi gửi dữ liệu
                                            if (value == null) {
                                                const valueUpdate = {
                                                    ...defaultValueUpdate,
                                                    originalEstimate: 0
                                                }
                                                const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                                dispatch(action);
                                            } else {
                                                const valueUpdate = {
                                                    ...defaultValueUpdate,
                                                    originalEstimate: value
                                                }
                                                const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                                dispatch(action)
                                            }
                                        }, 100)
                                    }} />
                                </div>
                                <div className="time-tracking">
                                    <p>Time Tracking</p>
                                    <div className="d-flex">
                                        <i className='fa fa-clock' style={{ marginRight: 20 }} />
                                        {renderTimeTracking()}
                                    </div>
                                    <div className='d-flex' style={{ marginTop: 10 }}>
                                        <InputNumber min={0} style={{ width: '100%', marginRight: 10 }} onChange={(value) => {
                                            if (searchRef.current) {
                                                clearTimeout(searchRef.current)
                                            }
                                            searchRef.current = setTimeout(() => {
                                                if (value == null) {
                                                    const valueUpdate = {
                                                        ...defaultValueUpdate,
                                                        timeTrackingSpent: 0
                                                    }
                                                    const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                                    dispatch(action);
                                                } else {
                                                    const valueUpdate = {
                                                        ...defaultValueUpdate,
                                                        timeTrackingSpent: value
                                                    }
                                                    const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                                    dispatch(action)
                                                }
                                            }, 100)
                                        }} />
                                        <InputNumber min={0} style={{ width: '100%', marginLeft: 10 }} onChange={(value) => {
                                            if (searchRef.current) {
                                                clearTimeout(searchRef.current)
                                            }
                                            searchRef.current = setTimeout(() => {
                                                if (value == null) {
                                                    const valueUpdate = {
                                                        ...defaultValueUpdate,
                                                        timeTrackingRemaining: 0
                                                    }
                                                    const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                                    dispatch(action);
                                                } else {
                                                    const valueUpdate = {
                                                        ...defaultValueUpdate,
                                                        timeTrackingRemaining: value
                                                    }
                                                    const action = updateTaskDetailAPI(valueUpdate, Number(taskDetail?.projectId), Number(taskDetail?.taskId));
                                                    dispatch(action)
                                                }
                                            }, 100)
                                        }} />
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </Modal >
        </div >

    )
}
