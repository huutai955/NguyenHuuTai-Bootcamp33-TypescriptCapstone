import React, { useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup'
import { createProjectAPI, getProjectAllAPI, getProjectCategoryAPI } from '../../redux/reducers/projectReducer';
import { setVisible } from '../../redux/reducers/modalReducer';
import { getAllUserAPI } from '../../redux/reducers/userReducer';
import { history, settings } from '../../util/config';
import AdditionalUserList from '../../components/UserModal/AdditionalUserList';

type Props = {}

export interface CategoryProject {
  id: number;
  projectCategoryName: string;
}
type MyValue = { projectName: string, description: string, categoryId: number | string }

export default function Project({ }: Props) {
  const { arrCategory } = useSelector((state: RootState) => state.projectReducer);
  const { userProfile } = useSelector((state: RootState) => state.userReducer);
  const dispatch: DispatchType = useDispatch();
  const formik: FormikProps<MyValue> = useFormik<MyValue>({
    initialValues: {
      projectName: "",
      description: "",
      categoryId: 1,
    },
    validationSchema: Yup.object().shape({
      projectName: Yup.string()
        .required("Project name is not empty!!"),
      description: Yup.string()
        .required("Description is not empty!!")
    }),
    onSubmit: (values: any) => {
      const action = createProjectAPI(values);
      dispatch(action);
    }
  })

  // Xử lý nghiệp vụ cho description
  const handleEditorChange = (content: string, editor: any) => {
    formik.setFieldValue('description', content)
  }


  useEffect(() => {
    if (!settings.getStore("accessToken")) {
      history.push("/")
    } else {
      const action = getProjectCategoryAPI();
      dispatch(action);
    }
  }, [])

  useEffect(() => {
    if (userProfile === null) {
      history.push("/")
    }
  }, [userProfile])


  
  return (
    <>
      <div className='project'>
        <div className="container">
          <p style={{ fontWeight: 700 }}>Jira Project / <span style={{ color: '#e53935' }}>Create Projects</span></p>
          <div className='d-flex' style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>Create Project</h3>
            <p style={{ fontWeight: 700, cursor: 'pointer'}} onClick={() => {
              const action = setVisible(true);
              dispatch(action);
              const actionUsers = getAllUserAPI();
              dispatch(actionUsers);
              const actionProjects = getProjectAllAPI();
              dispatch(actionProjects);
            }}>Add User</p>
          </div>
          <form className='form' onSubmit={formik.handleSubmit}>
            <div className="form-group mb-3">
              <p>Project Name</p>
              <input type="text" name='projectName' className='form-control' onChange={formik.handleChange} />
              <p className='text-danger'>{formik.errors.projectName}</p>
            </div>
            <div className="form-group">
              <p>Description</p>
              <Editor
                onEditorChange={handleEditorChange}
                tagName='description'
                initialValue=''
                init={{
                  height: 500,
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
              <p className='text-danger'>{formik.errors.description}</p>
            </div>
            <div className="form-group">
              <p>Project Category</p>
              <select className='form-control' name="categoryId" onChange={formik.handleChange}>
                {arrCategory?.map((project: CategoryProject, index: number) => {
                  return <option value={project.id} key={index}>{project.projectCategoryName}</option>
                })}
              </select>
              <p className='text-danger'>{formik.errors.categoryId}</p>
            </div>
            <button className='btn btn-primary mt-3'>Create Project</button>
          </form>
        </div>
      </div>
      <AdditionalUserList />
    </>
  )
}

