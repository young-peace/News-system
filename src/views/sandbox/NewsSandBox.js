import React,{useEffect} from 'react'
import NewsRouter from '../../components/sandbox/NewsRouter'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './NewsSandBox.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '../../util/http'

import { Layout } from 'antd';
const { Content } = Layout;

export default function NewsSandBox() {
  // NProgress.start()
  // useEffect(()=>{
  //   NProgress.done()
  // })
  return (
      <Layout>
          
          <SideMenu></SideMenu>
          <Layout className="site-layout">          
            <TopHeader></TopHeader>
            <Content className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                "overflow": "auto"
              }}>
            <NewsRouter></NewsRouter>    
            </Content>
          </Layout>          
      </Layout>
  )
}
