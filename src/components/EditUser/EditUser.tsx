import { Modal } from 'antd'
import { Formik, FormikProps, useFormik } from 'formik'
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
                .email("Email không đúng định dạng!!")
                .required("Email không được để trống!!"),
            passWord: Yup.string()
                .required("Password không được để trống!!")
                .min(6, "Password phải dài hơn 6 ký tự!!")
                .max(15, "Password phải ít hơn 15 ký tự!!"),
            name: Yup.string()
                .required("Tên không được bỏ trống!!"),
            phoneNumber: Yup.string()
                .required("Số điện thoại không được bỏ trống !!")
                .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không hợp lệ!!")
        })
        ,
        onSubmit: (values: MyValue) => {
            const action = editUserAPI(values);
            dispatch(action);
            const actionVisible = setVisibleEditUser(false);
            dispatch(actionVisible);
        }
    })
    const handleCancel = () => {
        const action = setVisibleEditUser(false);
        dispatch(action);
    }
    return (
        <Modal title="Edit User" open={visibleEditUser} onCancel={handleCancel}>
            <form className='form' onSubmit={updateUser.handleSubmit}>
                <div className="form-group">
                    <p className='m-0'>User ID</p>
                    <input type="text" className='form-control' disabled value={updateUser.values.id || ''} onChange={updateUser.handleChange} />
                </div>
                <div className="row mb-3">
                    <div className="col-6">
                        <p className='m-0'>Password</p>
                        <input type="password" className='form-control' name='passWord' onChange={updateUser.handleChange} />
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