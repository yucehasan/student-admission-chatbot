import React, { useState, useEffect, useMemo } from 'react'
import PreviousChats, { ChatHistory } from './PreviousChats.tsx'

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: 'Arial, sans-serif'
  },
  chatBox: {
    width: '80%',
    maxWidth: '600px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    overflowY: 'scroll'
  },
  message: {
    borderRadius: '8px',
    padding: '10px',
    margin: '5px 0',
    maxWidth: '70%',
    wordWrap: 'break-word'
  },
  myMessage: {
    backgroundColor: '#d1f7d1',
    alignSelf: 'flex-end'
  },
  otherMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start'
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    width: '100%',
    maxWidth: '600px'
  },
  input: {
    width: '80%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  sendButton: {
    width: '15%',
    padding: '10px',
    border: 'none',
    backgroundColor: '#5cb85c',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  }
}

const ChatScreen = () => {
  const clientId = useMemo(() => Math.floor(new Date().getTime() / 1000), [])

  const [websckt, setWebsckt] = useState<WebSocket | null>(null)
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Array<any>>([])
  const [prevChats, setPrevChats] = useState<ChatHistory>([])

  useEffect(() => {
    const url = 'ws://0.0.0.0:3004/ws/' + clientId
    const ws = new WebSocket(url)
    ws.onopen = (event) => {
      ws.send('Connect')
    }

    ws.onmessage = (e) => {
      const newMessage = JSON.parse(e.data)
      setMessages((messages) => [...messages, newMessage])
    }

    setWebsckt(ws)

    return () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    const lsPrevChatStr = localStorage.getItem('chats')
    const lsPrevChats = lsPrevChatStr ? JSON.parse(lsPrevChatStr) : {}
    setPrevChats(Object.values(lsPrevChats))

    return () => {
      if (messages.length > 2) {
        const connectMessage = messages[0]
        const firstMessage = messages[1]
        const uid = connectMessage.chatId
        const lsPrevChatStr = localStorage.getItem('chats')
        const lsPrevChats = lsPrevChatStr ? JSON.parse(lsPrevChatStr) : {}
        lsPrevChats[uid] = {
          thumbnail: firstMessage.message.substring(0, 10),
          chat: messages,
          uid: uid
        }
        localStorage.setItem('chats', JSON.stringify(lsPrevChats))
      }
    }
  }, [messages])

  const sendMessage = () => {
    console.log('Sending message:', message)
    if (websckt) {
      websckt.send(message)
      setMessages((oldMessages) => [
        ...oldMessages,
        { clientId: clientId, message: message }
      ])
    }
    setMessage('')
  }

  return (
    <div style={styles.container}>
      <PreviousChats chats={prevChats} />
      <h1>Conestoga College Student Chatbot</h1>
      <div style={styles.chatBox}>
        {messages.map((value, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(value.clientId === clientId
                ? styles.myMessage
                : styles.otherMessage)
            }}
          >
            <p>{value.message}</p>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Chat message ..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button style={styles.sendButton} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatScreen
