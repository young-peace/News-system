import React, { useState} from 'react'
import { Editor } from "react-draft-wysiwyg"
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"


export default function NewsEditor(props) {
  const [editorState,setEditorState]=useState()
  return (
      <div>
          <Editor
            // editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        // 富文本编辑器失去焦点后获取文本框内的数据
        // 子组件将文本框内的数据作为函数参数传给父组件
        onBlur={() => { 
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
          />
    </div>
  )
}
