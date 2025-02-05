import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import Add from "../img/addAvatar.png"

const Register = () => {
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value

    try {
      // Create user with email and password
      const res = await createUserWithEmailAndPassword(auth, email, password)
      console.log("User created:", res.user)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setErr(true)
      setLoading(false)
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Zap Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Loading..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/register">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
