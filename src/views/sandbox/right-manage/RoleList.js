import React, { useState,useEffect} from 'react'
import axios from 'axios'
import { Button, Table,Modal,Tree } from 'antd'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'

export default function RoleList() {
  const { confirm } = Modal;
  const [dataSource, setdataSource] = useState([])
  // 树形结构显示的数据
  const [rightList, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  // 对话框是否显示
  const [isModalVisible, setisModalVisible] = useState(false)

  const [currentId, setcurrentId] = useState(0)


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {return <b>{ id}</b>}
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      // 不写dataIndex，拿到的是整个对象
      render: (item) => { return <div>
        <Button danger shape="circle" icon={<DeleteOutlined />}
          onClick={() => confirmMethod(item)}/>       
        <Button type="primary" shape="circle" icon={<EditOutlined />}
          onClick={() => {
            // 点击编辑按钮时对话框出现
            setisModalVisible(true)
            // 获取当前点击这一行角色的权限列表
            setcurrentRights(item.rights)
            // 获取当前点击这一行角色的id
            setcurrentId(item.id)
          }} />
      </div>}
    } 
  ]
  useEffect(() => { 
    axios.get("/roles").then(res => {
      setdataSource(res.data)
    });
    // 请求树形结构显示的数据
    axios.get("/rights?_embed=children").then(res => { 
      setrightList(res.data)
    })
  }, [])
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
    axios.delete(`/roles/${item.id}`)
  }
  // 点击对话框中的取消按钮时对话框消失
  const handleCancel = () => { 
    setisModalVisible(false)
  }
  const handleOk = () => { 
    setisModalVisible(false)
    // 同步datasource
    setdataSource(dataSource.map(item => { 
      if (item.id === currentId) { 
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    // 将改变的权限数据同步到后端
    axios.patch(`/roles/${currentId}`, {
      rights:currentRights
    })
  }
  const onCheck = (CheckedKeys) => { 
    // 点击取消或勾选复选框时更新状态
    setcurrentRights(CheckedKeys.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        // 这个接口后端数据库没有key值，但table组件需要key
        rowKey={(item) => item.id}></Table>
      {/* visible 对话框是否可见 */}
      <Modal title="权限分配" visible={isModalVisible} onOk={ handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          //默认选中的复选框节点
          checkedKeys={currentRights}
          // 点击复选框触发，
          // 这时点击复选框没有产生任何变化，需要写方法让其数据重新渲染后才能得到复选框按钮的变化
          onCheck={onCheck}
          // 父子节点选中状态不再关联
          checkStrictly={true}
          // treeNodes 数据
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
