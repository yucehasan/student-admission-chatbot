import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8000')

function ChatScreen() {
  const [messages, setMessages] = useState<Array<any>>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, { sender: 'bot', text: msg }])
    })
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { sender: 'user', text: input }])
    socket.emit('message', input)
    setInput('')
  }

  return (
    <div>
      <div>
        <h1>Chatbot</h1>
        <div>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.sender === 'user' ? 'text-right' : 'text-left'}
            >
              <p
                className={`inline-block p-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300'
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="w-full mt-2 bg-blue-500 text-white p-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export { ChatScreen }
