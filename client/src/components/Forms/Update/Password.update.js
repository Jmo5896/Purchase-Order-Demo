import React, { useState } from 'react'
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap'

import API from '../../../services/auth.service'

export default function UpdatePostForm(props) {
  const [validated, setValidated] = useState(false)
  const [password, setPassword] = useState('')
  const [validatedPassword, setValidatedPassword] = useState(false)

  const resetState = () => {
    setValidated(false)
    setPassword('')
    setValidatedPassword(false)
  }

  const verify_password = (e) => {
    const val = e.target.value
    if (
      val.includes('`') ||
      val.includes('&') ||
      val.includes('*') ||
      val.includes('=') ||
      val.includes(';') ||
      val.includes('<') ||
      val.includes('>') ||
      val.includes('|') ||
      val.includes(',') ||
      val.includes('"') ||
      val === password
    ) {
      setValidated(true)
    } else {
      setValidated(false)
    }
  }

  const verify_old_password = async (e) => {
    const val = e.target.value
    setPassword(val)

    const passwordVerfication = async (val) => {
      try {
        await API.checkPassword({ password: val })
        setValidatedPassword(true)
      } catch (err) {
        setValidatedPassword(false)
      }
    }

    await passwordVerfication(val)
  }

  const checkEntry = (futureData) => {
    const tempData = { ...futureData }
    for (const v of Object.values(tempData)) {
      if (v) {
        setValidated(false)
        return true
      }
    }
    return false
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    let data = {
      ...formDataObj
    }

    const sendData = async (data) => {
      props.onHide()
      API.resetPassword(data)
      if (props.post.isLoading) {
        return props.post.isLoading()
      }
      window.location.reload()
    }
    const form = e.target
    if (
      form.checkValidity() === false ||
      !checkEntry(data) ||
      data.new_password !== data.verify_new_password ||
      !validatedPassword
    ) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      sendData(data)
      resetState()
    }
  }

  const closeModal = () => {
    props.onHide()
    resetState()
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={6} md={7} sm={8} xs={10} className="center">
          <Alert variant="warning">
            The password must be between 6 and 40 characters and may contain letters,
            numbers, and special characters. The following specialnp characters are NOT
            ALLOWED: ` & * = ; &lt; &gt; | , "
          </Alert>
          <Form noValidate validated={validated} onSubmit={onFormSubmit}>
            <Form.Group>
              <Form.Label>Enter old password:</Form.Label>
              <Form.Control
                required
                onChange={verify_old_password}
                name="old_password"
                type="password"
                as="input"
                maxLength={40}
                minLength={6}
              />
              {!validatedPassword ? (
                <Alert variant="danger">Match old Password.</Alert>
              ) : (
                <Alert variant="success">Password Matches!</Alert>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Enter new password:</Form.Label>
              <Form.Control
                required
                onChange={verify_password}
                name="new_password"
                type="password"
                as="input"
                maxLength={40}
                minLength={6}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Re-enter new password:</Form.Label>
              <Form.Control
                required
                onChange={verify_password}
                name="verify_new_password"
                type="password"
                as="input"
                maxLength={40}
                minLength={6}
              />
            </Form.Group>
            {validated && (
              <Alert variant="danger">
                Missing required fields, original password was not entered, illegal
                characters, new password matches old password, nothing has been entered,
                password doesn't meet length requirements, or the new passwords don't
                match.
              </Alert>
            )}
            <Button variant="success m-2" type="submit">
              Submit
            </Button>
            <Button variant="warning m-2" onClick={closeModal} type="button">
              Exit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
