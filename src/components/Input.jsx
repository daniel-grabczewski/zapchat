import React, { useContext, useState, useRef } from 'react'
import Img from '../img/img.png'
import Attach from '../img/attach.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Input = () => {
  const [text, setText] = useState('')
  const [img, setImg] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)

  const fileInputRef = useRef(null)
  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const handleSend = async () => {
    if (!text.trim() && !img) return

    if (img) {
      const storageRef = ref(storage, uuid())
      const uploadTask = uploadBytesResumable(storageRef, img)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: progress logic
        },
        (error) => {
          console.error('Image upload error:', error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          await updateDoc(doc(db, 'chats', data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          })
        }
      )
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      })
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: { text },
      [data.chatId + '.date']: serverTimestamp(),
    })

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: { text },
      [data.chatId + '.date']: serverTimestamp(),
    })

    setText('')
    setImg(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImg(file)
      setPreviewLoading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewUrl(event.target.result)
        setPreviewLoading(false)
      }
      reader.onerror = () => {
        setPreviewLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="input">
      <div className="input__container">
        <input
          type="text"
          placeholder="Type something..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          value={text}
          className="input__text"
        />
        {previewUrl && (
          <div className="image-preview">
            {previewLoading ? (
              <div className="image-preview__spinner-container">
                <div className="spinner"></div>
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                className="image-preview__img"
                onLoad={() => setPreviewLoading(false)}
              />
            )}
            <button
              onClick={() => {
                setImg(null)
                setPreviewUrl(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="image-preview__remove"
            >
              X
            </button>
          </div>
        )}
      </div>

      <div className="input__send">
        <input
          type="file"
          id="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file" style={{ cursor: 'pointer' }}>
          <img src={Img} className="uploadButton" alt="Upload" />
        </label>
        <div className="send">
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Input
