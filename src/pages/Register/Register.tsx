import React from 'react'
import { useFormik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { postSignUpAPI } from '../../redux/reducers/userReducer';
import { DispatchType } from '../../redux/configStore';
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom';

type Props = {}
type MyValue = { email: string, passWord: string, passwordConfirm: string, name: string, phoneNumber: string };
type MyValueAccount = { email: string, passWord: string, name: string, phoneNumber: string };
export default function Register({ }: Props) {
  const dispatch: DispatchType = useDispatch()

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
        .email("Your email is incorrect to email format !!")
        .required("Email is not empty!!"),
      passWord: Yup.string()
        .required("Password is not empty!!")
        .min(6, "Password length is more than 6 characters!!")
        .max(15, "Password length is less than 15 characters!!"),
      passwordConfirm: Yup.string()
        .required("Password confirm is not empty!!")
        .oneOf([Yup.ref('passWord')], "Password confirm is incorrect to password!!")
      ,
      name: Yup.string()
      .matches(/^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/, "Name cannot contain special characters!!")
      .required("Name is not empty!!"),
      phoneNumber: Yup.string()
      .required("Phone number is not empty!! !!")
      .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "The phone number is not in the correct Vietnamese phone number format!!")
    }),
    onSubmit: (values: MyValue) => {
      const account: MyValueAccount = {
        email: values.email,
        passWord: values.passWord,
        name: values.name,
        phoneNumber: values.phoneNumber
      }
      const action = postSignUpAPI(account);
      dispatch(action);
    }
  })


  return (
    <div className='register'>
      <div className="container">
        <form className='form' onSubmit={formik.handleSubmit}>
          <h2>Register</h2>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <p>Email</p>
                <input type="text" className='form-control' name='email' onChange={formik.handleChange} />
                <p className='text-danger'>{formik.errors.email}</p>
              </div>
              <div className="form-group">
                <p>Password</p>
                <input type="password" className='form-control' name='passWord' onChange={formik.handleChange} />
                <p className='text-danger'>{formik.errors.passWord}</p>
              </div>
              <div className="form-group">
                <p>Password Confirm</p>
                <input type="password" className='form-control' name='passwordConfirm' onChange={formik.handleChange} />
                <p className='text-danger'>{formik.errors.passwordConfirm}</p>
              </div>
              <NavLink to={"/"}>You have already an account ?</NavLink>
            </div>
            <div className="col-6">
              <div className="form-group">
                <p>Name</p>
                <input type="text" className='form-control' name='name' onChange={formik.handleChange} />
                <p className='text-danger'>{formik.errors.name}</p>
              </div>
              <div className="form-group">
                <p>Phone</p>
                <input type="text" className='form-control' name='phoneNumber' onChange={formik.handleChange} />
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