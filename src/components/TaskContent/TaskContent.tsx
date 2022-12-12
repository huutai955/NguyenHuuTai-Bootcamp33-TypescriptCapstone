import { Avatar, Tooltip } from 'antd'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DispatchType, RootState } from '../../redux/configStore'
import { getAllCommentAPI } from '../../redux/reducers/commentReducer'
import { setVisibleTask } from '../../redux/reducers/modalReducer'
import { getAllPriorityAPI } from '../../redux/reducers/priorityReducer'
import { getAllStatusAPI } from '../../redux/reducers/statusReducer'
import { getAllTaskAPI, getTaskDetailAPI, updateStatusAPI, updateTaskDetailAPI } from '../../redux/reducers/taskReducer'


type Props = {}

export default function TaskContent({ }: Props) {
    const { detailProject } = useSelector((state: RootState) => state.projectReducer)
    const dispatch: DispatchType = useDispatch();
    const params = useParams()

    // Xử lý nghiệp vụ cho Drag
    const handleDrag = (result: any) => {
        const valueUpdate = {
            "taskId": result.draggableId,
            "statusId": result.destination.droppableId
        }
        const action = updateStatusAPI(valueUpdate, Number(params.id));
        dispatch(action);
    }
    return (
        <DragDropContext onDragEnd={handleDrag}>
            <div className="row">
                {detailProject?.lstTask.map((task, index) => {
                    return <Droppable key={index} droppableId={task.statusId}>
                        {(provided) => {
                            return <div ref={provided.innerRef} {...provided.droppableProps} className="col-3" key={index}>
                                <div className="card">
                                    <div className="card-header">
                                        {task.statusName}
                                    </div>
                                    <div className="card-body" style={{ minHeight: 300 }}>
                                        {task.lstTaskDeTail?.map((detail, index) => {
                                            return <Draggable key={detail.taskId.toString()} index={index} draggableId={detail.taskId.toString()}>
                                                {(provided) => {
                                                    return <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="card p-2 mb-3" key={index} onClick={() => {
                                                        const actionModal = setVisibleTask(true)
                                                        dispatch(actionModal)
                                                        const action = getTaskDetailAPI(detail.taskId);
                                                        dispatch(action);
                                                        const actionComment = getAllCommentAPI(detail.taskId)
                                                        dispatch(actionComment);
                                                        const actionTaskType = getAllTaskAPI();
                                                        dispatch(actionTaskType);
                                                        const actionStatus = getAllStatusAPI();
                                                        dispatch(actionStatus);
                                                        const actionPriority = getAllPriorityAPI();
                                                        dispatch(actionPriority);
                                                    }}>
                                                        <p style={{ fontWeight: 700 }}>{detail.taskName}</p>
                                                        <div className="body d-flex justify-content-between">
                                                            <p>{detail.priorityTask.priority}</p>
                                                            <div className="member">
                                                                <Avatar.Group maxCount={2} key={index}>
                                                                    {detail.assigness.map((avatar: any, index: number) => {
                                                                        return <Tooltip title={avatar.name} key={index}>
                                                                            <Avatar style={{ backgroundColor: '#87d068' }} src={avatar.avatar} />
                                                                        </Tooltip>

                                                                    })}
                                                                </Avatar.Group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }}

                                            </Draggable>
                                        })}
                                    </div>
                                </div>
                                {provided.placeholder}
                            </div>
                        }}

                    </Droppable>
                })}
            </div>
        </DragDropContext>
    )
}