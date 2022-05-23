// 用户列表
import React, { forwardRef, useEffect, useState } from 'react'
import { Form,Input ,Select} from 'antd'
const { Option}=Select
// forwardRef，带有形参props、ref
const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    // 每次数组中的值改变时都会重新更新一遍
    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])
  const { roleId,region } = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3":"editor"
  }
  // 根据创建和更新行为不同
  const checkRegionDisabled = (item) => { 
    // 如果是更新
    if (props.isUpdate) { 
      // 如果是超级管理员，不禁用区域的选择
      if (roleObj[roleId] === "superadmin") {
        return false
      } else { 
        return true
      }
    }
    // 如果是创建
    else {
      if (roleObj[roleId] === "superadmin") {
        return false
      } else { 
        return item.value!==region
      }
    }
  }
  
  // 
  const checkRoleDisabled = (item) => { 
    // 如果是更新
    if (props.isUpdate) { 
      // 如果是超级管理员，不禁用区域的选择
      if (roleObj[roleId] === "superadmin") {
        return false
      } else { 
        return true
      }
    }
    // 如果是创建
    else {
      if (roleObj[roleId] === "superadmin") {
        return false
      } else { 
        return roleObj[item.id]!=="editor"
      }
    }
  }
  return (
    <div>
          <Form  
              ref={ ref}    
        layout="vertical"        
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
        <Input />
        </Form.Item>
        <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
        name="region"
        label="区域"
        rules={isDisabled?[]:[{ required: true, message: 'Please input the title of collection!' }]}                  
        >
          <Select disabled={isDisabled}>
          {
            //父组件给子组件传值   
              props.regionList.map(item => <Option value={item.value}
                key={item.id}
                // 根据登录用户权限进行区域的过滤选择
                disabled={checkRegionDisabled(item)}
              >{item.title}</Option>)
            }             
          </Select>
        </Form.Item>
        <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true, message: 'Please input the title of collection!' }]}
              >
                  {/* 根据相应角色设置区域 */}
                  <Select onChange={(value) => { 
                      if (value === 1) {
                          setisDisabled(true)
                        //   获取当前角色框的值
                          ref.current.setFieldsValue({
                              region: ""
                          })
                      } else { 
                          setisDisabled(false)
                      }
                  }}>
            {
              props.roleList.map(item => <Option value={item.id}
                key={item.id} disabled={ checkRoleDisabled(item)}>{ item.roleName}</Option>)
            }             
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
})
export default UserForm