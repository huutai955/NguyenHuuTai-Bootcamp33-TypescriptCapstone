import React, { useEffect, useState } from 'react'
import { Col, Image, Row } from 'antd'
import { useParams } from 'react-router-dom'
import { editUserAPI, getUserByIdAPI } from '../../redux/reducers/userReducer'
import { DispatchType, RootState } from '../../redux/configStore'
import { useDispatch, useSelector } from 'react-redux'
import { history, settings } from '../../util/config'
import { FormikProps, useFormik } from 'formik'
import * as Yup from 'yup';
import '../../assests/scss/pages/_userinfor.scss'

type Props = {}
type MyValue = { id: string | number, passWord: string, email: string, name: string, phoneNumber: string }
export default function UserInfor({ }: Props) {
    const { userInfor } = useSelector((state: RootState) => state.userReducer)
    const { userProfile } = useSelector((state: RootState) => state.userReducer);
    const dispatch: DispatchType = useDispatch();
    const params = useParams();
    const updateUser: FormikProps<MyValue> = useFormik<MyValue>({
        enableReinitialize: true,
        initialValues: {
            id: userInfor[0]?.userId,
            passWord: '',
            email: userInfor[0]?.email,
            name: userInfor[0]?.name,
            phoneNumber: userInfor[0]?.phoneNumber

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
                .matches(/^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/, "Name cannot contain special characters!!")
                .required("Name is not empty!!"),
            phoneNumber: Yup.string()
                .required("Phone number is not empty!! !!")
                .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "The phone number is not in the correct Vietnamese phone number format!!")
        }),
        onSubmit: (values: MyValue) => {
            const action = editUserAPI(values)
            dispatch(action);
        }
    })


    useEffect(() => {
        if (!settings.getStore("accessToken")) {
            history.push("/")
        } else {
            const action = getUserByIdAPI(Number(params.id));
            dispatch(action);
        }
    }, []);

    useEffect(() => {
        const action = getUserByIdAPI(Number(params.id));
        dispatch(action);
    }, [params.id])

    useEffect(() => {
        if (userProfile === null) {
            history.push("/")
        }
    }, [userProfile])

    return (
        <>
            <Row className='p-3'>
                <Col style={{ textAlign: 'center' }} xs={24} lg={4} >
                    <Image
                        width={100}
                        src={userInfor[0]?.avatar}
                        style={{ borderRadius: '50%' }}
                    />
                </Col>
                <Col style={{}} xs={24} lg={20}>
                    <form className='form m-4' onSubmit={updateUser.handleSubmit}>
                        <div className="form-group  mb-3">
                            <p className='m-0'>User ID</p>
                            <input type="text" className='form-control' disabled value={updateUser.values.id || ""} onChange={updateUser.handleChange} />

                        </div>
                        <div className="form-group  mb-3" >
                            <p className='m-0'>Name</p>
                            <input type="text" className='form-control' name='name' value={updateUser.values.name || ""} onChange={updateUser.handleChange} />
                            <p className='text-danger'>{updateUser.errors.name}</p>
                        </div>
                        <div className="form-group  mb-3">
                            <p className='m-0'>Email</p>
                            <input type="text" className='form-control' name='email' value={updateUser.values.email || ""} onChange={updateUser.handleChange} />
                            <p className='text-danger'>{updateUser.errors.email}</p>
                        </div>
                        <div className="form-group mb-3">
                            <p className='m-0'>Phone Number</p>
                            <input type="text" className='form-control' name='phoneNumber' value={updateUser.values.phoneNumber || ""} onChange={updateUser.handleChange} />
                            <p className='text-danger'>{updateUser.errors.phoneNumber}</p>
                        </div>

                        {settings.getStorageJson("userProfile")?.id === userInfor[0]?.userId ?
                            <>
                                <div className="form-group  mb-3">
                                    <p className='m-0'>Password</p>
                                    <input type="password" className='form-control' name='passWord' onChange={updateUser.handleChange} />
                                    <p className='text-danger'>{updateUser.errors.passWord}</p>
                                </div>
                                <div className="form-group mb-3 text-end">
                                    <button className='btn btn-primary'>Update Information</button>
                                </div>
                            </>
                            : <></>
                        }
                    </form>
                </Col>
            </Row>
        </>
    )
}