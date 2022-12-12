import React, { useEffect, useState } from 'react'
import { Button, Drawer, Modal, RadioChangeEvent, Select, SelectProps, Slider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { setVisible, setVisibleEditTask, setVisibleTask } from '../../redux/reducers/modalReducer';
import { Editor } from '@tinymce/tinymce-react'
import { getDetailProjectByIdAPI, getProjectAllAPI } from '../../redux/reducers/projectReducer';
import { getAllPriorityAPI } from '../../redux/reducers/priorityReducer';
import { createTaskAPI, getAllTaskAPI } from '../../redux/reducers/taskReducer';
import { getAllStatusAPI } from '../../redux/reducers/statusReducer';
import { getAllUserAPI, getArrMembersByProjectID } from '../../redux/reducers/userReducer';
import { useFormik, FormikProps } from 'formik';
import * as Yup from 'yup';


type Props = {}
type MyValue = {
  taskName: string, statusId: number | string | undefined | null, description: string, originalEstimate: number | string,
  timeTrackingSpent: number | string,
  timeTrackingRemaining: number | string,
  projectId: number | string,
  typeId: number | string,
  priorityId: number | string,
  listUserAsign: number[]
};
export default function Popup({ }: Props) {
  const { visibleEditTask } = useSelector((state: RootState) => state.modalReducer);
  const { arrProject, detailProject } = useSelector((state: RootState) => state.projectReducer);
  const { arrPriority } = useSelector((state: RootState) => state.priorityReducer);
  const { arrTask, taskDetail } = useSelector((state: RootState) => state.taskReducer);
  const { arrStatus } = useSelector((state: RootState) => state.statusReducer);
  const { arrMembers } = useSelector((state: RootState) => state.userReducer);
  const dispatch: DispatchType = useDispatch();
  const [timeSpent, setTimeSpent] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const createTask: FormikProps<MyValue> = useFormik<MyValue>({
    enableReinitialize: true,
    initialValues: {
      taskName: "",
      description: "",
      statusId: arrStatus[0]?.statusId,
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: arrProject[0]?.id,
      typeId: arrTask[0]?.id,
      priorityId: arrPriority[0]?.priorityId,
      listUserAsign: []
    },
    validationSchema: Yup.object().shape({
      taskName: Yup.string()
        .required("Task name is not empty!!"),
      description: Yup.string()
        .required("Description is not empty!!"),
      listUserAsign: Yup.array()
        .min(1, "List user is not empty!!. If your project is not any members. Let's add some members")
    }),
    onSubmit: (values: MyValue, { resetForm }) => {
      const action = createTaskAPI(values);
      dispatch(action)
      // Khi nào trang ở Task Component thì sẽ gọi API để load lại dữ liệu
      if (detailProject?.id) {
        const actionDetail = getDetailProjectByIdAPI(detailProject?.id)
        dispatch(actionDetail);
      }
      resetForm()
    }
  })


  // Xử lý nghiệp vụ cho Drawer
  const handleCancel = () => {
    const action = setVisibleEditTask(false);
    dispatch(action)
  }

  // Xử lý nghiệp vụ cho phần projectId và assignees khi chọn project sẽ call api và load lại
  // phần assignees
  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const actionMembers = getArrMembersByProjectID(Number(e.target.value));
    dispatch(actionMembers);
    createTask.setFieldValue("projectId", e.target.value)
  }

  useEffect(() => {
    if (arrProject[0]?.id !== undefined) {
      const actionMembers = getArrMembersByProjectID(arrProject[0]?.id);
      dispatch(actionMembers);
    }
  }, [arrProject])

  return (
    <div>
      <Drawer
        title="Create a new task"
        width={720}
        onClose={handleCancel}
        open={visibleEditTask}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <p className='text-danger' style={{ textAlign: 'right', fontWeight: 700 }}>*Only project's creator can edit or create their new task</p>
        <form className='form' onSubmit={createTask.handleSubmit}>
          <div className="form-group">
            <p>Project</p>
            <select className='form-control' name='projectId' value={createTask.values.projectId || ''} onChange={handleChangeSelect}>
              {arrProject.map((user, index) => {
                return <option key={index} value={user.id}>{user.projectName}</option>
              })}
            </select>
          </div>
          <div className="form-group">
            <p>TaskName</p>
            <input type="text" name='taskName' className='form-control' value={createTask.values.taskName || ""} onChange={createTask.handleChange} />
            <p className='text-danger m-0 p-0'>{createTask.errors.taskName}</p>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <p>Priority</p>
                <select className='form-control' name='priorityId' onChange={createTask.handleChange}>
                  {arrPriority?.map((priority, index) => {
                    return <option key={index} value={priority.priorityId}>{priority.priority}</option>
                  })}
                </select>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <p>Task Type</p>
                <select className='form-control' name='typeId' onChange={createTask.handleChange}>
                  {arrTask?.map((task, index) => {
                    return <option key={index} value={task.id}>{task.taskType}</option>
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="form-group">
            <p>Status</p>
            <select className='form-control' name='statusId' onChange={createTask.handleChange}>
              {arrStatus?.map((status, index) => {
                return <option key={index} value={status.statusId}>{status.statusName}</option>
              })}
            </select>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <p>Assignees</p>
                <Select
                  mode="tags"
                  placeholder="Please select"
                  className={"listUserAsign"}
                  value={createTask.values.listUserAsign || ""}
                  onChange={(values) => {
                    createTask.setFieldValue('listUserAsign', values);
                  }
                  }
                  style={{ width: '100%' }}
                  options={arrMembers?.map((user) => {
                    return {
                      value: user.userId.toString(),
                      label: user.name
                    }
                  })}
                />
                <p className='text-danger m-0 p-0'>{createTask.errors.listUserAsign}</p>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <p>Time Tracking</p>
                <Slider value={timeSpent} max={timeSpent + timeRemaining} />
                <div className="row">
                  <div className="col-6">
                    <p>Time Spend(Hour)</p>
                    <input type="number" min={0} defaultValue={0} className='form-control' name='timeTrackingSpent' onChange={(e) => {
                      let { value } = e.target;
                      let numberValue = Number(value)
                      setTimeSpent(numberValue);
                      createTask.setFieldValue('timeTrackingSpent', value);
                    }} />
                  </div>
                  <div className="col-6">
                    <p>Time Remaining(Hour)</p>
                    <input type="number" defaultValue={0} min={0} className='form-control' name='timeTrackingRemaining' onChange={(e) => {
                      let { value } = e.target;
                      let numberValue = Number(value)
                      setTimeRemaining(numberValue);
                      createTask.setFieldValue('timeTrackingRemaining', value);
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <p>Estimate</p>
            <input type="number" defaultValue={0} min={0} max={24} className='form-control' name='originalEstimate' onChange={createTask.handleChange} />
          </div>
          <div className="form-group">
            <p>Decriptions</p>
            <Editor
              onEditorChange={(cotent, editor) => {
                createTask.setFieldValue("description", cotent);
              }}
              tagName='description'
              initialValue={createTask.values.description || ""}
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
            <p className='text-danger m-0 p-0'>{createTask.errors.description}</p>
          </div>
          <div className='btnForm'>
            <button className='btn btn-primary mt-3'>Create New Task</button>
            {/* <button type='reset' className='btn mt-3' style={{ backgroundColor: '#c7c7c7', marginLeft: 10 }}>Reset Form</button> */}
          </div>
        </form>
      </Drawer>
    </div>
  )
}