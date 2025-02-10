import React, { useState } from "react"

const Chats = () => {
  const [chats, setChats] = useState([])

  return (
    <div className="chats">
      <p>Chats will be displayed here.</p>
    </div>
  )
}

export default Chats
