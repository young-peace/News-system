import React, { useState,useEffect} from 'react'
import axios from 'axios'
import { Button, Table,Modal } from 'antd'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined,UploadOutlined} from '@ant-design/icons'

const { confirm } = Modal;
export default function NewsDraft() {
  
  const [dataSource, setdataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => { 
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      setdataSource(res.data)
      
    })
  }, [])
  console.log(dataSource)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => { return <b>{id}</b> }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      // title,item顺序不能写错
      render: (title,item) => { 
        return <a href={ `#/news-manage/preview/${item.id}`} > {title}</a>       
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => { 
        return category.title
      }
    },
    {
      title: '操作',
      // 不写dataIndex，拿到的是整个对象
      render: (item) => { return <div>
        <Button danger shape="circle" icon={<DeleteOutlined />}
          onClick={() => confirmMethod(item)} />  
        <Button type="primary" shape="circle" icon={<EditOutlined />}/>
        <Button type="primary" shape="circle" icon={<UploadOutlined />}/>
      </div>}
    } 
  ]
  
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
  // 删除
  const deleteMethod = (item) => { 
    // 当前页面同步状态+后端同步
    // 将除了这个id的数据都显示出来
    setdataSource(dataSource.filter(data => data.id !== item.id))
    // 删除这个id的数据
    axios.delete(`/news/${item.id}`)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        // 这个接口后端数据库没有key值，但table组件需要key
        rowKey={(item) => item.id} pagination={{pageSize:5}}></Table>
    </div>
  )
}
