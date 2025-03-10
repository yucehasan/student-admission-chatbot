import React, { useMemo, useState } from 'react'
import './animation.css'

export type ChatHistory = Array<{
  uid: string
  thumbnail: string
  messages: Array<string>
}>

const styles = {
  container: {
    alignSelf: 'flex-end',
    position: 'fixed',
    top: '10%',
    right: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  chatBox: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  toggleButton: {
    backgroundColor: 'rgb(37, 99, 235)',
    padding: '6px',
    color: 'white',
    borderRadius: '12px',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px',
    cursor: 'pointer',
    borderWidth: '0px'
  }
}

const mountedStyle = { animation: 'inAnimation 300ms ease-in' }
const unmountedStyle = {
  animation: 'outAnimation 270ms ease-out',
  animationFillMode: 'forwards'
}

const PreviousChats = (props: { chats: ChatHistory }) => {
  const { chats } = props
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const toggle = () => {
    setIsMounted(!isMounted)
    if (!isOpen) setIsOpen(true)
  }

  const listComponent = (
    <div
      style={{
        ...styles.chatBox,
        ...(isMounted ? mountedStyle : unmountedStyle)
      }}
      onAnimationEnd={() => {
        if (!isMounted) setIsOpen(false)
      }}
    >
      {chats && chats.length > 0 ? (
        <ul>
          {chats.map((chat) => (
            <li key={chat.uid}>{chat.thumbnail}...</li>
          ))}
        </ul>
      ) : (
        <p>No chat found</p>
      )}
    </div>
  )

  const showList = () => {
    if (isOpen) {
      return listComponent
    }
  }

  return (
    <div style={styles.container}>
      <button style={styles.toggleButton} onClick={toggle}>
        History
      </button>
      {showList()}
    </div>
  )
}

export default PreviousChats
