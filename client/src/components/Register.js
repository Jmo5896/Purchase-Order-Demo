import React, { useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import { isEmail } from 'validator'
import AuthService from '../services/auth.service'
import API from '../services/details.service'

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    )
  }
}

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    )
  }
}

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    )
  }
}

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    )
  }
}

export default function Register(props) {
  const form = useRef()
  const checkBtn = useRef()
  const query = new URLSearchParams(useLocation().search)

  console.log(query.get('username'))

  const [username, setUsername] = useState(query.get('username') || '')
  const [email, setEmail] = useState(query.get('email') || '')
  const [password, setPassword] = useState('')
  const [passwordC, setPasswordC] = useState('')
  const [successful, setSuccessful] = useState(false)
  const [message, setMessage] = useState('')

  const onChangeUsername = (e) => {
    const username = e.target.value
    setUsername(username)
  }

  const onChangeEmail = (e) => {
    const email = e.target.value
    setEmail(email)
  }

  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

  const onChangePasswordC = (e) => {
    const password = e.target.value
    setPasswordC(password)
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    setMessage('')
    setSuccessful(false)

    form.current.validateAll()

    if (checkBtn.current.context._errors.length === 0 && password === passwordC) {
      try {
        const response = await AuthService.register(username, email, password)
        setMessage(response.data.message)
        setSuccessful(true)
        await API.create(response.data)
        await AuthService.login(username, password)
        props.history.push('/profile')
        window.location.reload()
      } catch (error) {
        console.log(error.response)
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()

        setMessage(resMessage)
        setSuccessful(false)
      }
    }
  }

  return (
    <div className="col-md-12">
      <div className="card-login card-container round2 shadow">
        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, vusername]}
                />
                <small className="text-danger pl-3">
                  The username must be between 3 and 20 characters.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>
              <small className="text-danger pl-3">
                The password must be between 6 and 40 charactersand may contain letters,
                numbers, and characters.
                <br />
                The following characters are NOT ALLOWED:
                <br /> ` & * = ; &lt; &gt; | , "
                <br />
              </small>
              <div className="form-group">
                <label htmlFor="passwordC">Confirm Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="passwordC"
                  value={passwordC}
                  onChange={onChangePasswordC}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-success btn-dark btn-block border">
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={successful ? 'alert alert-success' : 'alert alert-danger'}
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: 'none' }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  )
}
