import React, { useState, useEffect, useMemo, use } from 'react'
import ReactMarkdown from 'react-markdown'

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
    padding: '0 10px',
    margin: '5px 0',
    maxWidth: '70%',
    wordWrap: 'break-word',
    minWidth: '30px'
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

  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isQuerying, setIsQuerying] = useState<boolean>(false)

  const url = 'http://0.0.0.0:3004/'

  const addWaitingMessage = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { clientId: 1, message: 'Awaiting response...' }
    ])
  }

  const removeWaitingMessage = () => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.clientId !== 1)
    )
  }

  const addErrorMessage = () => {
    removeWaitingMessage()
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        clientId: 1,
        message: 'Error occurred in the system. Refresh the page and try again'
      }
    ])
  }

  const sendMessage = () => {
    if (message.trim() === '') {
      return
    }
    // Send request to url defined above
    setMessages((prevMessages) => [...prevMessages, { clientId, message }])
    setIsQuerying(true)
    fetch(url + 'chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
      .then((response) => response.json())
      .then((data) => {
        setIsQuerying(false)
        setMessages((prevMessages) => [
          ...prevMessages,
          { clientId: 0, message: data.message }
        ])
      })
      .catch((error) => {
        addErrorMessage()
        console.error('Error:', error)
      })
    setMessage('')
  }
  const healthCheck = () => {
    fetch(url)
      .then((response) => response.status)
      .then((status) => {
        if (status === 200) {
          console.log('Server is healthy')
          setIsLoading(false)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  useEffect(() => {
    healthCheck()
  }, [])

  useEffect(() => {
    if (isQuerying) {
      addWaitingMessage()
    } else {
      removeWaitingMessage()
    }
  }, [isQuerying])

  return (
    <div style={styles.container}>
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
            <ReactMarkdown>{value.message}</ReactMarkdown>
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
        <button
          style={styles.sendButton}
          disabled={isLoading}
          onClick={sendMessage}
        >
          {isLoading ? 'Connecting...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default ChatScreen
