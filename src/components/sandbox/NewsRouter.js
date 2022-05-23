//登录之后的路由
import React, { useEffect,useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import { CheckCircleOutlined } from '@ant-design/icons'

// const LocalRouterMap = {
//     "/home": <Home/>,
//     "/user-manage/list": <UserList/>,
//     "/right-manage/role/list": <RoleList/>,
//     "/right-manage/right/list": <RightList/>,
//     "/news-manage/add": <NewsAdd/>,
//     "/news-manage/draft": <NewsDraft/>,
//     "/news-manage/category": <NewsCategory/>,
//     "/audit-manage/audit": <Audit/>,
//     "/audit-manage/list": <AuditList/>,
//     "/publish-manage/unpublished": <Unpublished/>,
//     "/publish-manage/published": <Published/>,
//     "/publish-manage/sunset": <Sunset/>       
// }
export default function NewsRouter() {
    // const [BackRouteList, setBackRouteList] = useState([])
    // useEffect(() => {
    //     Promise.all([
    //         axios.get("/rights"),
    //         axios.get("/children"),
    //     ]).then(res => {
    //         setBackRouteList([...res[0].data, ...res[1].data])
    //         console.log([...res[0].data, ...res[1].data])
    //     })
    // }, [])  
    // 管理员中某条路由被取消后，侧边栏中这条路由选项应该消失，相应的url也应该无法加载
    // 有些页面（NewsPreview）在侧边栏没有选项，想要显示就只能在条件中添加routepermisson的值
    // const checkRoute = (item) => { 
    //     return LocalRouterMap[item.key] && (item.pagepermisson && item.routepermisson)
    // }
    // // 不同全权限的管理员，侧边栏有不同的显示
    // const checkUserPermission = (item) => { 
    //     return rights.includes(item.key)
    // }
  return (
      <div>
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/user-manage/list" element={ <UserList/>}></Route>
            <Route path="/right-manage/role/list" element={ <RoleList/>}></Route>
            <Route path="/right-manage/right/list" element={<RightList />}></Route>  
            <Route path="/news-manage/add" element={ <NewsAdd/>}></Route>               
            <Route path="/news-manage/draft" element={ <NewsDraft/>}></Route>               
            <Route path="/news-manage/preview/:id" element={ <NewsPreview/>}></Route>               

            <Route path="/" element={<Navigate to="/home" />} />   
            <Route path="*" element={ <Nopermission/>}></Route>                            
          </Routes>
        {/* <Routes>
            {
                  BackRouteList.map((item) => {
                      if (checkRoute(item) && checkUserPermission(item)) { 
                          return <Route path={item.key} key={item.key}
                          element={LocalRouterMap[item.key]} exact={ true}></Route>
                      }
                      return <Nopermission/>
                      
              })
              }    
            <Route path="/" element={<Navigate to="/home" />} />   
            <Route path="*" element={ <Nopermission/>}></Route>   
        </Routes> */}
      </div>
  )
}
