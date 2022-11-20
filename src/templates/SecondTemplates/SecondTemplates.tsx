import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

export default function SecondTemplates({}: Props) {
  return (
    <div className='d-flex'>
        <div className="w-50" style={{height: window.innerHeight}}>
          <img src="./img/bg.jpg" alt=""  className='w-100' style={{height:window.innerHeight}}/>
        </div>
        <div className="w-50 theme">
          <Outlet />
        </div>
    </div>
  )
}