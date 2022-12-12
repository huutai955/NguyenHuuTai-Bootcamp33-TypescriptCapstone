import { Col, Row } from 'antd'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
import { Layout } from 'antd';


const { Content, Sider } = Layout;


type Props = {}

export default function FirstTemplates({ }: Props) {
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Header />
      </Sider>
      <Layout>
        <Content >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}