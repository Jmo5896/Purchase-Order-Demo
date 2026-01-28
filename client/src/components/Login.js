import React, { useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Form from 'react-validation/build/form'
import Input from 'react-validation/build/input'
import CheckButton from 'react-validation/build/button'
import ModalButton from './Modal'
import ForgotUsername from './Forms/Update/UserName.resend'
import ForgotPassword from './Forms/Update/Password.resend'
import AuthService from '../services/auth.service'

import Logo from '../imgs/poflo/logo200New.png'

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    )
  }
}

export default function Login(props) {
  const form = useRef()
  const checkBtn = useRef()
  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const propHistory = useHistory()

  const onChangeUsername = (e) => {
    const username = e.target.value
    setUsername(username)
  }

  const onChangePassword = (e) => {
    const password = e.target.value
    setPassword(password)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    setMessage('')
    setLoading(true)

    form.current.validateAll()

    if (checkBtn.current.context._errors.length === 0) {
      try {
        await AuthService.login(username, password)
        propHistory.push('poflow/dashboard')
        window.location.reload()
      } catch (error) {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
        setMessage(resMessage)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  return (
    <div className="login col-md-12 mt-5">
      <div className="card-login round2 shadow pt-5 mt-5 card-container rounded">
        <img src={Logo} alt="profile-img" className="profile-img-card" />

        <Form onSubmit={handleLogin} ref={form}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Input
              type="text"
              className="form-control center slow-box"
              name="username"
              value={username}
              onChange={onChangeUsername}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className="form-control center slow-box"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
          </div>

          <div className="form-group">
            <button
              className="btn btn-Success center btn-med round1 btn-dark btn-block mt-4 mb-3"
              disabled={loading}
            >
              {loading && <span className="spinner-border spinner-border-sm"></span>}
              <span className="upper">Login</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: 'none' }} ref={checkBtn} />
        </Form>
        <div className="row pt-3">
          <ModalButton
            form={ForgotUsername}
            classes="col-5 center"
            modalTitle="Forgot your username?"
            updateDeleteInfo={props.id}
            button={true}
            btnClasses="btn bg-prime round1 btn-link btn-sm text-white no-link"
            btnText="reset username"
            status={2}
          />
          <ModalButton
            form={ForgotPassword}
            classes="col-5 center"
            modalTitle="Forgot your password?"
            updateDeleteInfo={props.id}
            button={true}
            btnClasses="btn bg-warning round1 btn-link btn-sm text-white no-link"
            btnText="reset password"
            status={2}
          />
        </div>
      </div>
    </div>
  )
}
