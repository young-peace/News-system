import React, { useEffect,useState} from 'react'
import { Button, Table, Tag, Modal, Popover,Switch } from 'antd'
import axios from 'axios'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'

export default function RightList() {
  const { confirm } = Modal;
  const [dataSource, setdataSource] = useState([])
  useEffect(() => { 
    axios.get("/rights?_embed=children").then(res => { 
      const list = res.data
      list.forEach(item => { 
        if (item.children.length === 0) { 
          item.children=""
        }
      })
      setdataSource(res.data)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {return <b>{ id}</b>}
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => { 
        // 这里的形参可以随便写，取值都为dataIndex
        return <Tag color="orange">{ key}</Tag>
      }
    },
    {
      title: '操作',
      // 不写dataIndex，拿到的是整个对象
      render: (item) => <div>
        <Popover content={
          <div style={{ textAlign: "center" }}>
            <Switch checked={item.pagepermisson} onClick={ ()=>switchMethod(item)}></Switch>
          </div>}
          title="页面配置项"
          trigger={item.pagepermisson === undefined ? '' : 'click'}>
          <Button type="primary" shape="circle"
            icon={<EditOutlined />}
            disabled={item.pagepermisson === undefined} />
        </Popover>
        <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
      </div>
    },
  ];
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
    if (item.grade === 1) {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`/rights?${item.id}`)
    } else { 
      // 如果当前要删除的数据在第二级
      // 找出当前二级菜单的上一级
      let list = dataSource.filter(data => data.id === item.rightId)
      // 排除当前二级菜单的数据
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setdataSource([...dataSource])
      axios.delete(`/children?${item.id}`)

    }
    
  }
  const switchMethod = (item) => { 
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setdataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else { 
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }
  return (
    <div ><Table dataSource={dataSource} columns={columns}
      pagination={{
        pageSize:5
      }}
    /></div>
  )
}
