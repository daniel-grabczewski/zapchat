import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)
  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  // Helper function to format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now'
    // If the timestamp is a Firebase timestamp, it has a toDate() method.
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp.seconds * 1000)
    return date.toLocaleString()
  }

  return (
    <div
      ref={ref}
      className={`message ${
        message.senderId === currentUser.uid ? 'owner' : ''
      }`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="User Avatar"
        />
        <span>{message.date ? formatTimestamp(message.date) : 'Just now'}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="Message Content" />}
      </div>
    </div>
  )
}

export default Message
