import React, { useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup'
import { createProjectAPI, getProjectCategoryAPI } from '../../redux/reducers/projectReducer';

type Props = {}

export interface CategoryProject {
  id: number;
  projectCategoryName: string;
}
type MyValue = { projectName: string, description: string, categoryId: number | string}

export default function Project({ }: Props) {
  const { detailProject, arrCategory } = useSelector((state: RootState) => state.projectReducer);
  const dispatch: DispatchType = useDispatch();
  const formik: FormikProps<MyValue> = useFormik<MyValue>({
    initialValues: {
      projectName: "",
      description: "",
      categoryId: 1,
    },
    validationSchema: Yup.object().shape({
      projectName: Yup.string()
        .required("Vui lòng nhập tên dự án!!"),
      description: Yup.string()
        .required("Vui lòng nhập nội dung!!")
    }),
    onSubmit: (values: any) => {
      const action = createProjectAPI(values);
      dispatch(action);
    }
  })

  const handleEditorChange = (content: string, editor: any) => {
    formik.setFieldValue('description', content)
  }
  useEffect(() => {
    const action = getProjectCategoryAPI();
    dispatch(action);
  }, [])


  return (
    <div className='project'>
      <div className="container">
        <h3>Create Project</h3>
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
          <button className='btn btn-primary'>Create Project</button>
        </form>
      </div>
    </div>
  )
}