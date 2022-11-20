import React from 'react'
import {useFormik, FormikProps} from 'formik'
import { useSelector,useDispatch } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { postSigninAPI } from '../../redux/reducers/userReducer';
import { NavLink } from 'react-router-dom';


type Props = {}
type MyValue = {email: string, passWord: string};

export default function Login({}: Props) {
  const {userProfile} = useSelector((state: RootState) => state.userReducer);
  const dispatch:DispatchType = useDispatch()
  const formik: FormikProps<MyValue> = useFormik<MyValue>({
    initialValues: {
      email: '',
      passWord: ''
    }, 
    onSubmit:(values: MyValue) => {
      const action = postSigninAPI(values);
      dispatch(action);
    }
  })

  return (
    <div className='login'>
        <h2>Login</h2> 
        <form className='form' onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <p>Email</p>
            <input type="text"  className='form-control' name='email' onChange={formik.handleChange}/>
          </div>
          <div className="form-group">
            <p>Password</p>
            <input type="text"  className='form-control' name='passWord' onChange={formik.handleChange}/>
          </div>
          <div className="form-group">
           <button type='submit' className='btn btn-success loginBtn'>Login</button>
          </div>
        </form>
        <NavLink className='registerBtn' to={'/register'}>Create New Account</NavLink>
    </div>
  )
}