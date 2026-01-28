import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import API from '../../../services/auth.service'

export default function PasswordForm(props) {
  const [validated, setValidated] = useState(false)
  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    let formDataObj = Object.fromEntries(formData.entries())

    const data = {
      email: formDataObj.email
    }

    const sendData = async (data) => {
      props.onHide()
      API.sendPassword(data)
    }
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      sendData(data)
    }
    setValidated(true)
  }

  const closeModal = () => {
    props.onHide()
    setValidated(false)
  }

  return (
    <Form noValidate validated={validated} onSubmit={onFormSubmit}>
      <div className="row">
        <Form.Group className="col-sm-12 col-lg-10">
          <Form.Label>Enter your email and we'll send you a new one:</Form.Label>
          <Form.Control required name="email" placeholder="example@email.com" />
          <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Please enter your email to coninue.
          </Form.Control.Feedback>
        </Form.Group>
      </div>
      <Button variant="success m-2" type="submit">
        Submit
      </Button>
      <Button variant="warning m-2" onClick={closeModal} type="button">
        Exit
      </Button>
    </Form>
  )
}
