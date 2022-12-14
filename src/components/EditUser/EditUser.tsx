import { Modal } from 'antd'
import { FormikProps, useFormik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { DispatchType, RootState } from '../../redux/configStore'
import { setVisibleEditUser } from '../../redux/reducers/modalReducer'
import * as Yup from 'yup'
import { editUserAPI } from '../../redux/reducers/userReducer'


type Props = {}
type MyValue = { id: number | undefined | null, email: string, passWord: string, name: string, phoneNumber: string };
export default function EditUser({ }: Props) {
    const { visibleEditUser } = useSelector((state: RootState) => state.modalReducer)
    const { userInfor } = useSelector((state: RootState) => state.userReducer)
    const dispatch: DispatchType = useDispatch();
    const updateUser: FormikProps<MyValue> = useFormik<MyValue>({
        enableReinitialize: true,
        initialValues: {
            id: Number(userInfor[0]?.userId),
            email: userInfor[0]?.email,
            phoneNumber: userInfor[0]?.phoneNumber,
            name: userInfor[0]?.name,
            passWord: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .email("Your email is incorrect to email format !!")
                .required("Email is not empty!!"),
            passWord: Yup.string()
                .required("Password is not empty!!")
                .min(6, "Password length is more than 6 characters!!")
                .max(15, "Password length is less than 15 characters!!"),
            name: Yup.string()
                .required("Name is not empty!!"),
            phoneNumber: Yup.string()
                .required("Phone number is not empty!! !!")
                .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "The phone number is not in the correct Vietnamese phone number format!!")
        })
        ,
        onSubmit: (values: MyValue, {resetForm}) => {
            const action = editUserAPI(values);
            dispatch(action);
            const actionVisible = setVisibleEditUser(false);
            dispatch(actionVisible);
            resetForm();
        }
    })


    // Xử lý nghiệp vụ đóng mở cho modal
    const handleCancel = () => {
        const action = setVisibleEditUser(false);
        dispatch(action);
    }
    return (
        <Modal closable={true} title="Edit User" open={visibleEditUser} onCancel={handleCancel}>
            <form className='form' onSubmit={updateUser.handleSubmit}>
                <div className="form-group">
                    <p className='m-0'>User ID</p>
                    <input type="text" className='form-control' disabled value={updateUser.values.id || ''} onChange={updateUser.handleChange} />
                </div>
                <div className="row mb-3">
                    <div className="col-6">
                        <p className='m-0'>Password</p>
                        <input type="password" className='form-control' value={updateUser.values.passWord || ""} name='passWord' onChange={updateUser.handleChange} />
                        <p className='text-danger' style={{ fontWeight: 400 }}>{updateUser.errors.passWord}</p>
                    </div>
                    <div className="col-6">
                        <p className='m-0'>Email</p>
                        <input type="text" className='form-control' name='email' value={updateUser.values.email || ''} onChange={updateUser.handleChange} />
                        <p className='text-danger' style={{ fontWeight: 400 }}>{updateUser.errors.email}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <p className='m-0'>Name</p>
                        <input type="text" className='form-control' name='name' value={updateUser.values.name || ''} onChange={updateUser.handleChange} />
                        <p className='text-danger' style={{ fontWeight: 400 }}>{updateUser.errors.name}</p>
                    </div>
                    <div className="col-6">
                        <p className='m-0'>Phone</p>
                        <input type="text" className='form-control' name='phoneNumber' value={updateUser.values.phoneNumber || ''} onChange={updateUser.handleChange} />
                        <p className='text-danger' style={{ fontWeight: 400 }}>{updateUser.errors.phoneNumber}</p>
                    </div>
                </div>
                <div className="form-group d-flex" style={{ justifyContent: 'end' }}>
                    <button className='btn btn-primary mt-3'>Update User</button>
                </div>
            </form>
        </Modal>
    )
}