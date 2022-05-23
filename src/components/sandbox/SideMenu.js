import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import './index.css'
import 'antd/dist/antd.css'
import axios from 'axios'

import { Layout, Menu } from 'antd'
import { Link} from 'react-router-dom'
import {
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage":<UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage":<UserOutlined />,
  "/right-manage/role/list":<UserOutlined />,
  "/right-manage/right/list":<UserOutlined />
}
const checkPagePermission = (item) => { 
  return item.pagepermisson===1
}

export default function SideMenu(props) {
  const [menu,setMenu]=useState([])
  useEffect(() => { 
    axios.get("/rights?_embed=children").then(res => { 
      // console.log(res.data)
      setMenu(res.data)
    })
  }, [])
  
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const checkPagePermission = (item) => { 
    return item.pagepermisson && rights.includes(item.key)
  }

  const renderMenu = (menuList) => { 
    return menuList.map(item => { 
      if (item.children?.length>0 && checkPagePermission(item)) { 
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            { renderMenu(item.children)}
          </SubMenu>          
        )
      }
      return (checkPagePermission(item) && <Menu.Item key={item.key} icon={item.icon}>
        <Link to={item.key }>{item.title}</Link>        
      </Menu.Item>)
    })    
  }
  const location = useLocation()
  const selectKeys = [location.pathname]
  const openKeys=["/"+location.pathname.split("/")[1]]

  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{display:"flex",height:"100%","flexDirection":"column"}}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={selectKeys}
            defaultOpenKeys={ openKeys}>
            {renderMenu(menu) }
          </Menu>
        </div>         
      </div>
    </Sider>
  )
}


