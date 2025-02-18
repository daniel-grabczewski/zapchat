import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase'
import Message from './Message'
import { formatTimestamp } from '../utils/formatTimestamp'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages)
      }
    })

    return () => {
      unSub()
    }
  }, [data.chatId])

  // Build the output with timestamp headers.
  const groupedMessages = []
  let previousDate = null

  messages.forEach((message) => {
    // Convert the message date to a JavaScript Date.
    const messageDate = message.date?.toDate
      ? message.date.toDate()
      : new Date(message.date.seconds * 1000)
    let showHeader = false

    if (!previousDate) {
      showHeader = true
    } else {
      const diff = messageDate.getTime() - previousDate.getTime()
      if (diff >= 10 * 60 * 1000) {
        // 10 minutes in milliseconds
        showHeader = true
      }
    }

    if (showHeader) {
      groupedMessages.push(
        <div key={`header-${message.id}`} className="timestampHeader">
          {formatTimestamp(message.date)}
        </div>
      )
    }

    groupedMessages.push(<Message key={message.id} message={message} />)

    previousDate = messageDate
  })

  return <div className="messages">{groupedMessages}</div>
}

export default Messages
