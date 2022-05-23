import React, { useEffect, useState, useRef} from 'react'
import UserForm from '../../../components/user-manage/UserForm'
import { Button, Table, Modal, Switch} from 'antd'
import axios from 'axios'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
const { confirm } = Modal

export default function UserList() {
  
  const [dataSource, setdataSource] = useState([])
  const [isAddvisible, setisAddvisible] = useState(false)
  const [isUpdateVisible,setisUpdateVisible]=useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  // 更新编辑
  const [current,setcurrent]=useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  
  // 根据登陆身份显示用户列表
  const { roleId,region,username}=JSON.parse(localStorage.getItem("token"))
  // 用户id转换成用户身份
  const roleObj = {
    "1": "superadmin",
    "2": "admin",
    "3":"editor"
  }
  useEffect(() => { 
    axios.get("/regions").then(res => { 
      const list = res.data
      setregionList(list)
    })
    axios.get("/roles").then(res => { 
      const list = res.data
      setroleList(list)
    })
    
    axios.get("/users?_expand=role").then(res => { 
      const list = res.data
    // 根据登陆身份显示用户列表
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        // 过滤出自己
        ...list.filter(item => item.username === username),
        // 过滤出与自己平级的区域管理员和低于自己的编辑
        ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
    ])    
    })
    // 返回这些数据
  }, [roleId,region,username,roleObj])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({ 
          text: item.title,
          value: item.value
        })),
        {
          text: "全球",
          value:"全球"
        }
      ],
      onFilter: (value, item) => { 
        if (value === "全球") { 
          return item.region===""
        }
        return item.region===value
      },
      render: (region) => {return <b>{ region===""?'全球':region}</b>}
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => { 
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onClick={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      // 不写dataIndex，拿到的是整个对象
      render: (item) => <div>         
        <Button danger shape="circle" icon={<DeleteOutlined />}
          onClick={() => confirmMethod(item)} disabled={ item.default}/>
        <Button type="primary" shape="circle"
          icon={<EditOutlined />} disabled={item.default}
          onClick={ ()=>handleUpdate(item)}/>
      </div>
    },
  ];
  const handleUpdate = (item) => { 
    // state是异步的
    setTimeout(() => { 
      // 更新的模态框出现
      setisUpdateVisible(true)
      if (item.roleId === 1) {
        // 禁用
        setisUpdateDisabled(true)
      } else { 
        // 取消禁用
        setisUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0)    
    // 保存更新的值
    setcurrent(item)
  }
  const handleChange = (item) => { 
    item.roleState = !item.roleState
    setdataSource([...dataSource])

    axios.patch(`/users/${item.id}`, {
      roleState:item.roleState
    })
  }

  const confirmMethod = (item) => { 
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const deleteMethod = (item) => { 
    // 当前页面同步状态+后端同步
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`https://localhost:5000/users/${item.id}}`)
  }
  const addFormOK = () => { 
    addForm.current.validateFields().then(value => { 
      // 模态框消失
      setisAddvisible(false)
      // 重置表单
      addForm.current.resetFields()
      // post到后端，生成id，再设置datasource，方便后面的删除和更新
      axios.post(`http://localhost:5000/users`, {
        ...value,
        "roleState": true,
        "default":false,
      }).then(res => { 
        setdataSource([...dataSource, {
          ...res.data,
          // role需要手动更新
          role:roleList.filter(item=>item.id===value.roleId)[0]
        }])
      })     
    }).catch(err => { 
      
    })
  }
  const UpdateFormOK = () => { 
    updateForm.current.validateFields().then(value => { 
      setisUpdateVisible(false)
      setdataSource(dataSource.map(item => { 
        if (item.id === current.id) { 
          return {
            ...item,
            ...value,
            role:roleList.filter(data=>data.id===value.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!isUpdateDisabled)
      axios.patch(`/users/${current.id}`,value)
    })
  }
  return (
    <div >
      <Button type="primary" onClick={() => { setisAddvisible(true)}}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
      pagination={{
        pageSize: 5
      }} rowKey={(item) => item.id}
      />
    <Modal
      visible={isAddvisible}
      title="添加用户"
      okText="确定"
      cancelText="取消"
        onCancel={() => { 
          setisAddvisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
      onOk={() => addFormOK()}
      >
        {/* 父组件传值给子组件 */}
        <UserForm regionList={regionList} roleList={roleList} ref={ addForm}
        ></UserForm>
      </Modal>
      
      <Modal
      visible={isUpdateVisible}
      title="更新用户"
      okText="更新"
      cancelText="取消"
        onCancel={() => { 
          setisUpdateVisible(false)
        }}
      onOk={() => UpdateFormOK()}
      >
        {/* 父组件传值给子组件 */}
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm}
          // 子组件传值给父组件
          isUpdateDisabled={isUpdateDisabled}
          // 标识是更新还是添加
          isUpdate={ true}
        ></UserForm>
    </Modal>
    </div>
  )
}
