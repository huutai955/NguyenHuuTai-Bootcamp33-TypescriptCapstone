import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import HeaderMobile from '../../components/Header/HeaderMobile'

type Props = {}

export default function FirstTemplatesMobile({ }: Props) {
  return (
    <>
      <HeaderMobile />

      <>
        <Outlet />
      </>
    </>

  )
}