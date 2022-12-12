import { Col, Row } from 'antd'
import React, {useEffect} from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

export default function SecondTemplates({ }: Props) {


  return (
    <Row>
      <Col xs={0} md={12}>
          <img src="./img/bg.jpg" alt="" className='w-100' style={{ height: '100vh' }} />
      </Col>
      <Col xs={24} md={12}>
        <Outlet />
      </Col>
    </Row>
  )
}