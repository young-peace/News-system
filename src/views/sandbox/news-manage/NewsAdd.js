import React, { useState, useEffect, useRef } from 'react'
import { useNavigate} from 'react-router-dom'
import {PageHeader,Steps,Form,Input,Button,Select, message,notification} from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'
const { Step } = Steps
const { Option } = Select;

export default function NewsAdd() {
  // 存储axios返回的目录信息
  const [categoryList, setCategoryList] = useState([])
  // 步骤状态
  const [current, setCurrent] = useState(0)
  // 收集表单中的信息，新闻标题&分类
  const [formInfo, setformInfo] = useState({})
  // 存储富文本编辑器中的值
  const [content, setContent] = useState("")
  // 表单校验
  const NewsForm = useRef(null)
  // 从本地中结构出用户相关数据
  const user = JSON.parse(localStorage.getItem("token"))
  // 路由跳转
  const navigate = useNavigate()
  // 下一步
  const handleNext = () => {
    // 点击下一步，如果是第0项，就收集表单数据（新闻标题&新闻分类）
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        setformInfo(res)
        setCurrent(current + 1)
      }).catch(error => {
        console.log(error)
      })
    } else {
      console.log(formInfo,content)
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空")
      } else {
        setCurrent(current + 1)
      }
    }
  }
  // 上一步
  const handlePrevious = () => {
    setCurrent(current - 1)
  }
  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  }
  useEffect(() => {
    axios.get("/categories").then(res => {
      setCategoryList(res.data)
    })
  }, [])
  const handleSave = (auditState) => { 
    // 将要发布的新闻数据存到数据库中
    axios.post('/news', {
      ...formInfo,
      "content": content,
      "region": user.region?user.region:"全球",
      "author": user.username,
      "roleId": user.roleId,
      "auditState":auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      "publishTime":0
    }).then(res => { 
      // auditState为0，跳转到草稿箱
      navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
      
      notification.info({
        message: `通知`,
        description:
          `您也可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,   
        placement:"bottomRight",
      });
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header" title="撰写新闻" />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      {/* 
      {
      && 或者 三目的写法都会导致不符合条件时销毁，切换到另一符合条件的时候再创建，无法保存值
        current === 0 && <div>111
        <inpput type="text"></inpput>
      </div>
      }
       */}
      <div style={{marginTop:"50px"}}>
        <div className={current === 0 ? '' : style.active}>
          {/* ref表单校验 */}
          <Form {...layout} ref={NewsForm}>
            <Form.Item name="title" label="新闻标题" rules={[{required: true, message:'标题不能为空'}]}>
              <Input />
            </Form.Item> 
            <Form.Item name="categoryId" label="新闻分类" rules={[{required: true,message:'请选择新闻分类'}]}>
              <Select>
                {
                  categoryList.map(item => 
                    <Option value={item.id} key={item.id}>{ item.title}</Option>
                   )
                }
                
              </Select>
            </Form.Item>    
          </Form> 
        </div>
        <div className={current === 1 ? '' : style.active}>
          {/* 父组件接受子组件传来的参数value */}
          <NewsEditor getContent={(value) => { 
            // 存新闻内容
              setContent(value)
          }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}>
        </div>
    </div>
      
      
      <div style={{ marginTop: "50px" }}>     
        {
          current > 0 && <Button type="primary" onClick={ handlePrevious}>上一步</Button>       
        }
        {
          current < 2 && <Button type="primary" onClick={ handleNext}>下一步</Button>       
        }
        {
          current == 2 && <span>
            <Button type="primary" onClick={ ()=>handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={ ()=>handleSave(1)}>提交审核</Button>
          </span>
        }  
      </div>
    </div>
  )
}
