import React from 'react'
import { useNavigate} from 'react-router-dom'


import './Login.css'
import { Form, Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from 'axios'
export default function Login(props) {
  // 收集提交的表单数据
  let navigate = useNavigate()
  const onFinish = (values) => { 
    console.log(values)
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
      (res) => { 
        console.log(res.data)
        if (res.data.length === 0) {
          message.error("用户名或密码不匹配")
        } else { 
          localStorage.setItem("token",JSON.stringify(res.data[0]))
          navigate("/")
          
        }
      }
    )
  }
  // const onFinish = (value) => {
  //   axios.get(`/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`).then((res) => {
  //       console.log(res.data);
  //       if (res.data.length === 0) {
  //           message.error("账号或密码错误!")
  //       } else {
  //           localStorage.setItem("token", JSON.stringify(res.data[0]))
  //           // props.history.push("/")
  //       }
  //   })
  // }
  return (
    <div style={{ backgroundColor: 'rgb(35,39,65)', height: "100%", overflow:"hidden"}}>
      <div className="formContainer">
        <div className="title">全球新闻发布管理系统</div>
        <Form
        name="normal_login"
          className="login-form"
          initialValues={{remember:true}}
        // 收集表单中的内容
        onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>      
    </div>
  )
}
