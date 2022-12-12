import React, { useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useSelector, useDispatch } from 'react-redux'
import { DispatchType, RootState } from '../../redux/configStore'
import { useFormik, FormikProps } from 'formik'
import { Button, Drawer, Space } from 'antd';
import { setVisible } from '../../redux/reducers/modalReducer'
import { CategoryProject, getProjectCategoryAPI, updateProjectAPI } from '../../redux/reducers/projectReducer'
import * as Yup from 'yup';

type Props = {}
type MyValue = { projectName: string | undefined, categoryId: number | string | undefined, description: string | undefined, id: number | string | undefined };

export default function EditProject({ }: Props) {
    const { detailProject, arrCategory } = useSelector((state: RootState) => state.projectReducer);
    const { visible } = useSelector((state: RootState) => state.modalReducer);
    const dispatch: DispatchType = useDispatch();
    const formik: FormikProps<MyValue> = useFormik<MyValue>({
        enableReinitialize: true,
        initialValues: {
            projectName: detailProject?.projectName,
            description: detailProject?.description,
            categoryId: detailProject?.projectCategory?.id,
            id: detailProject?.id
        },
        validationSchema: Yup.object().shape({
            projectName: Yup.string()
                .required("Project name is not empty!!"),
            description: Yup.string()
                .required("Description is not empty!!"),
            categoryId: Yup.string()
                .required("Category ID is not empty!!"),
        }),
        onSubmit: (values: MyValue) => {
            const action = updateProjectAPI(Number(values.id), values)
            dispatch(action);
        }
    })



    // Xử lý nghiệp vụ cho description
    const handleEditorChange = (content: string, editor: any) => {
        formik.setFieldValue('description', content)
    }

    // Xử lý nghiệp vụ cho Drawer
    const onClose = () => {
        const action = setVisible(false);
        dispatch(action);
    };

    useEffect(() => {
        const action = getProjectCategoryAPI();
        dispatch(action);
    }, [])


    return (
        <Drawer
            title="Create a new account"
            width={720}
            onClose={onClose}
            open={visible}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <form className='form' onSubmit={formik.handleSubmit}>
                <div className="row mb-4">
                    <div className="col-4">
                        <div className="form-group">
                            <p>Project ID</p>
                            <input disabled type="text" value={formik.values.id || ""} className='form-control' />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-group">
                            <p>Project Name</p>
                            <input type="text" name='projectName' value={formik.values.projectName || ""} className='form-control' onChange={formik.handleChange} />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-group">
                            <p>Project Category</p>
                            <select className='form-control' value={formik.values.categoryId || ""} name="categoryId" onChange={formik.handleChange} >
                                {arrCategory?.map((project: CategoryProject, index: number) => {
                                    return <option value={project.id} key={index}>{project.projectCategoryName}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <Editor
                    onEditorChange={handleEditorChange}
                    tagName='description'
                    initialValue={formik.values.description || ""}
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
                <p className='text-danger'>{formik.errors.categoryId || formik.errors.description || formik.errors.projectName}</p>
                <Space style={{ marginTop: 50 }} className="d-flex justify-content-end">
                    <Button onClick={onClose}>Cancel</Button>
                    <button type='submit' className='btn btn-primary' style={{padding: '4.1px 15px', border: '1px solid #fff', borderRadius: 'unset', fontSize: 14}}>
                        Submit
                    </button>
                </Space>
            </form>
        </Drawer>
    )
}