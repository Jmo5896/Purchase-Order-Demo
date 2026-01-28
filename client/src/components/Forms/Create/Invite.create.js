import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'

import API from '../../../services/invite.service'

export default function InviteForm(props) {
  const [validated, setValidated] = useState(false)

  const checkEntry = (futureData) => {
    const tempData = { ...futureData }
    for (const [k, v] of Object.entries(tempData)) {
      if (k === 'username' && v.length < 4) {
        return false
      }
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
    let formDataObj = Object.fromEntries(formData.entries())

    const data = {
      username: formDataObj.username,
      email: formDataObj.email,
      role: formDataObj.role
    }

    const sendData = async (data) => {
      props.onHide()
      await API.inviteUser(data)
      props.post.setLoading(true)
    }
    const form = e.currentTarget
    if (form.checkValidity() === false || !checkEntry(data)) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      setValidated(false)
      sendData(data)
    }
  }

  const closeModal = () => {
    props.onHide()
    setValidated(false)
  }

  return (
    <Form noValidate validated={validated} onSubmit={onFormSubmit}>
      <Form.Group controlId="formEmail">
        <Form.Label>
          Email: <span style={{ color: 'red' }}>*</span>
        </Form.Label>
        <Form.Control required name="email" placeholder="example@email.com" />
      </Form.Group>

      <Form.Group controlId="formUsername">
        <Form.Label>
          Username (Must be at least 4 characters long):{' '}
          <span style={{ color: 'red' }}>*</span>
        </Form.Label>
        <Form.Control
          required
          name="username"
          placeholder="firstName.lastName.1234"
          minLength={4}
        />
      </Form.Group>

      <Form.Group controlId="dropdownRoles">
        <Form.Label>Select role</Form.Label>
        <Form.Control required name="role" as="select" size="sm" custom>
          <option value="staff">Staff</option>
          <option value="director">Director</option>
          <option value="admin">Administrator</option>
          <option value="superAdmin">super Admininistrator</option>
        </Form.Control>
      </Form.Group>

      {validated && (
        <Alert variant="danger">
          Missing required fields, length requirements haven't been met, or nothing has
          been entered.
        </Alert>
      )}

      <Button variant="success m-2" type="submit" onClick={checkEntry}>
        Submit
      </Button>
      <Button variant="warning m-2" onClick={closeModal} type="button">
        Exit
      </Button>
    </Form>
  )
}
