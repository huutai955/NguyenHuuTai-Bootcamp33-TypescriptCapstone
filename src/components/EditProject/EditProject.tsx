import React, { useState, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useSelector, useDispatch } from 'react-redux'
import { DispatchType, RootState } from '../../redux/configStore'
import { useFormik, FormikProps } from 'formik'
import { Button, Drawer, Space } from 'antd';
import { setVisible } from '../../redux/reducers/modalReducer'
import { getProjectCategoryAPI, setDetailProject, updateProjectAPI } from '../../redux/reducers/projectReducer'
import ReactHTMLParse from 'react-html-parser';
import * as Yup from 'yup';

type Props = {}
type MyValue = { projectName: string, categoryId: number | string, description: string, id: number | string };
export interface CategoryProject {
    id: number;
    projectCategoryName: string;
}
export interface DetailProject {
    lstTask: LstTask[];
    members: Member[];
    creator: Creator;
    id: number;
    projectName: string;
    description: string;
    projectCategory: Creator;
    alias: string;
}
export interface Creator {
    id: number;
    name: string;
}
export interface LstTask {
    lstTaskDeTail: any[];
    statusId: string;
    statusName: string;
    alias: string;
}
export interface Member {
    userId: number;
    name: string;
    avatar: string;
}

export default function EditProject({ }: Props) {
    const { detailProject, arrCategory } = useSelector((state: RootState) => state.projectReducer);
    const { visible } = useSelector((state: RootState) => state.modalReducer);
    const dispatch: DispatchType = useDispatch();
    const formik: FormikProps<MyValue> = useFormik<MyValue>({
        initialValues: {
            projectName: "",
            description: "",
            categoryId: '',
            id: 0
        },
        validationSchema: Yup.object().shape({
            projectName: Yup.string()
                .required("Vui lòng cập nhật thông tin!!"),
            description: Yup.string()
                .required("Vui lòng cập nhật thông tin!!"),
            categoryId: Yup.string()
                .required("Vui lòng cập nhật thông tin!!"),
        }),
        onSubmit: (values: MyValue) => {
            const updateValues = {
                id: 0,
                projectName: formik.values.projectName,
                creator: 0,
                description: formik.values.description,
                categoryId: formik.values.categoryId
            }
            const action = updateProjectAPI(values.id, updateValues)
            dispatch(action);
        }
    })


    formik.handleChange = (e: any) => {
        let { value, name } = e.target;
        let newDetail: any = {
            ...detailProject,
            [name]: value
        }
        const action = setDetailProject(newDetail);
        dispatch(action)
        formik.setValues(newDetail)
    }

    const onClose = () => {
        const action = setVisible(false);
        dispatch(action);
    };

    useEffect(() => {
        const action = getProjectCategoryAPI();
        dispatch(action);
    }, [])

    useEffect(() => {
        const value = Number(formik.values.categoryId) - 1
        const newValue = arrCategory[value];
        let newDetail: any = {
            ...detailProject,
            projectCategory: newValue
        }
        const action = setDetailProject(newDetail)
        dispatch(action)
    }, [formik.values.categoryId])

    const handleEditorChange = (content: string, editor: any) => {
        formik.setFieldValue('description', content)
    }

    return (
        <div className='container'>
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
                                <input disabled type="text" value={detailProject?.id || ''} className='form-control' />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <p>Project Name</p>
                                <input type="text" name='projectName' value={detailProject?.projectName || ''} className='form-control' onChange={formik.handleChange} />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <p>Project Category</p>
                                <select className='form-control' value={detailProject?.projectCategory?.id || ''} name="categoryId" onChange={formik.handleChange} >
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
                        initialValue={detailProject?.description || ''}
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
                        <button type='submit'>
                            Submit
                        </button>
                    </Space>
                </form>
            </Drawer>

        </div>
    )
}