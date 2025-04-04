import React, { useState, useEffect, useMemo } from 'react'

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

const AlternateChatScreen = () => {
  const clientId = useMemo(() => Math.floor(new Date().getTime() / 1000), [])

  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Array<any>>([])

  const url = 'http://0.0.0.0:3004/chat/'

  const sendMessage = () => {
    console.log('Sending message:', message)

    if (message.trim() === '') {
      return
    }
    // Send request to url defined above
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { clientId, message },
          { clientId: 0, message: data.message }
        ])
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    setMessage('')
  }

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

export default AlternateChatScreen
