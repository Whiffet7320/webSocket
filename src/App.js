import './App.css'
import React, { useState, useEffect, useRef } from 'react'

var ws = null;
export default function App() {
  const containerRef = useRef()
  const [value, setValue] = useState('ws://123.207.136.134:9010/ajaxchattest');//ws://123.207.136.134:9010/ajaxchattest
  const [sendValue, setSendValue] = useState('');
  const [message, setMessage] = useState([{
    txt: '请先连接服务器',
    type: 'ws'
  }])
  useEffect(() => {
    console.log(message)
    scrollBottm();
    if(!ws){
      return
    }
    ws.onmessage = function (e) {
      console.log(e)
      server(e.data)
    }
  }, [message])
  let newMesssage = message.map((ele, i) => {
    return (
      <div key={i} className="newMesssage">
        <span className={ele.type}>{ele.txt}</span>
      </div>
    )
  })
  function connect(value) {
    if (ws) {
      return;
    }
    console.log(ws)
    ws = new WebSocket(value);
    // container
    ws.onopen = function () {
      console.log("服务器连接成功");
      setMessage([{
        txt: '服务器连接成功!!',
        type: 'ws'
      }])
    };
  }
  function send(sendValue) {
    if (ws) {
      if (sendValue === '') {
        return;
      }
      setMessage([
        ...message,
        {
          txt: `你发送的消息:${sendValue}`,
          type: 'client'
        }
      ])
      setSendValue('')
      ws.send(sendValue)
    } else {
      alert('连接出错！！')
    }
  }

  function server(msg) {
    // console.log(msg, message)
    setMessage([
      ...message,
      {
        txt: `服务器回应:${msg}`,
        type: 'server'
      }
    ])
  }

  function webSocketClose() {
    console.log(ws, message)
    if (ws) {
      ws.close()
      ws = null
      setMessage([
        ...message,
        {
          txt: `服务器已断开连接!`,
          type: 'close'
        }
      ])
    }
  }
  // 滚动条到底部
  function scrollBottm() {
    // console.log(containerRef)
    let el = containerRef.current
    el.scrollTop = el.scrollHeight;
  }
  return (
    <div className="App">
      <header className="header">
        <input type="text" value={value} onChange={(e) => {
          setValue(e.target.value)
        }} />
        <button onClick={() => {
          connect(value)
        }}>连接</button>
        <button onClick={() => {
          webSocketClose()
        }}>断开</button>
        {/* <button style={{ display: 'none' }} ref={btnRef} onClick={() => {
          server(serverValue)
        }}>服务器回应按钮（隐藏）</button> */}
      </header>
      <div className="container" ref={containerRef}>
        {newMesssage}
      </div>
      <footer className="footer">
        <input type="text"
          value={sendValue}
          onChange={e => {
            setSendValue(e.target.value)
          }}
          onKeyDown={e => {
            if (e.code === "NumpadEnter" || e.code === "Enter") {
              send(e.target.value)
            }
          }}
        />
        <button onClick={() => {
          send(sendValue)
        }}>发送</button>
      </footer>
    </div>
  )
}

