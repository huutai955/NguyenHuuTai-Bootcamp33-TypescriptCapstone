import React from 'react'
import { useFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { postSignUpAPI } from '../../redux/reducers/userReducer';
import { DispatchType } from '../../redux/configStore';
import {useDispatch} from 'react-redux'
import { NavLink } from 'react-router-dom';

type Props = {}
type MyValue = { email: string, passWord: string, passwordConfirm: string, name: string, phoneNumber: string };
type MyValueAccount = { email: string, passWord: string, name: string, phoneNumber: string };
export default function Register({ }: Props) {
  const dispatch:DispatchType = useDispatch()

  const formik: FormikProps<MyValue> = useFormik<MyValue>({
    initialValues: {
      email: '',
      passWord: '',
      passwordConfirm: '',
      name: '',
      phoneNumber: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Email không đúng định dạng!!")
        .required("Email không được để trống!!"),
      passWord: Yup.string()
        .required("Password không được để trống!!")
        .min(6, "Password phải dài hơn 6 ký tự!!")
        .max(15, "Password phải ít hơn 15 ký tự!!"),
      passwordConfirm: Yup.string()
        .required("Xác nhận mật khẩu không được bỏ trống")
        .oneOf([Yup.ref('passWord')], "Xác nhận mật khẩu không khớp với mật khẩu")
      ,
      name: Yup.string()
        .matches(/^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/, "Tên không được chứa ký tự đặc biệt!!")
        .required("Tên không được bỏ trống!!"),
      phoneNumber: Yup.string()
        .required("Số điện thoại không được bỏ trống !!")
        .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không hợp lệ!!")
    }),
    onSubmit: (values: MyValue) => {
        const account:MyValueAccount = {
          email: values.email,
          passWord: values.passWord,
          name: values.name,
          phoneNumber: values.phoneNumber
        }

      const action = postSignUpAPI(account);
      dispatch(action);
    }
  })

  console.log(formik.errors.email)

  return (
    <div className='register'>
      <div className="container">
        <form className='form' onSubmit={formik.handleSubmit}>
          <h2>Register</h2>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <p>Email</p>
                <input type="text" className='form-control'  name='email' onChange={formik.handleChange}/>
                <p className='text-danger'>{formik.errors.email}</p>
              </div>
              <div className="form-group">
                <p>Password</p>
                <input type="password" className='form-control'  name='passWord' onChange={formik.handleChange}/>
                <p className='text-danger'>{formik.errors.passWord}</p>
              </div>
              <div className="form-group">
                <p>Password Confirm</p>
                <input type="password" className='form-control'  name='passwordConfirm' onChange={formik.handleChange}/>
                <p className='text-danger'>{formik.errors.passwordConfirm}</p>
              </div>
              <NavLink to={"/login"}>You have already an account ?</NavLink>
            </div>
            <div className="col-6">
              <div className="form-group">
                <p>Name</p>
                <input type="text" className='form-control'  name='name' onChange={formik.handleChange}/>
                <p className='text-danger'>{formik.errors.name}</p>
              </div>
              <div className="form-group">
                <p>Phone</p>
                <input type="text" className='form-control'  name='phoneNumber' onChange={formik.handleChange}/>
                <p className='text-danger'>{formik.errors.phoneNumber}</p>
              </div>
            </div>
          </div>
          <div className="form-group">
            <button className='btnSignup'>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  )
}