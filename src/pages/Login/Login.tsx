import React from 'react'
import { useFormik, FormikProps } from 'formik'
import { useDispatch } from 'react-redux';
import { DispatchType } from '../../redux/configStore';
import { postSigninAPI } from '../../redux/reducers/userReducer';
import { NavLink } from 'react-router-dom';
import * as Yup from 'yup';
import FacebookLogin from 'react-facebook-login';
import swal from 'sweetalert';
import { ACCESSTOKEN, USER_PROFILE } from '../../util/config';
export interface ReactFacebookLoginInfo {
  id: string;
  userID: string;
  accessToken: string;
  name?: string | undefined;
  email?: string | undefined;
  picture?:
  | {
    data: {
      height?: number | undefined;
      is_silhouette?: boolean | undefined;
      url?: string | undefined;
      width?: number | undefined;
    };
  }
  | undefined;
}

type Props = {}
type MyValue = { email: string, passWord: string };

export default function Login({ }: Props) {
  const dispatch: DispatchType = useDispatch()
  const formik: FormikProps<MyValue> = useFormik<MyValue>({
    initialValues: {
      email: '',
      passWord: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email is not empty!!"),
      passWord: Yup.string()
        .required("Password is not empty!!")
    }),
    onSubmit: (values: MyValue) => {
      const action = postSigninAPI(values);
      dispatch(action);
    }
  })

  const responseFacebook = (response: ReactFacebookLoginInfo) => {
    console.log(response.accessToken);
    swal({
      title: 'Error',
      icon: 'error',
      text: 'This feature is being updated. Please try again'
    })
  }

  React.useEffect(() => {
    localStorage.removeItem(ACCESSTOKEN)
    localStorage.removeItem(USER_PROFILE)
  }, [])

  return (
    <div className='login'>
      <div className="container">
        <h2>Login</h2>
        <form className='form' onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <p>Email</p>
            <input type="text" className='form-control' name='email' onChange={formik.handleChange} />
            <p className='text-danger'>{formik.errors.email}</p>
          </div>
          <div className="form-group">
            <p>Password</p>
            <input type="password" className='form-control' name='passWord' onChange={formik.handleChange} />
            <p className='text-danger'>{formik.errors.passWord}</p>
           <p>Do you already have an account? <NavLink to={"/register"} style={{color: '#0d6efd'}}>Register now</NavLink></p>
          </div>
          <div className="form-group">
            <button type='submit' className='btn btn-success loginBtn'>Login</button>
          </div>
        </form>
        <div className="text-center">
          <FacebookLogin
            appId="706645737508006"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            cssClass="btn btn-primary p-2"
          />
        </div>
      </div>
    </div>
  )
}