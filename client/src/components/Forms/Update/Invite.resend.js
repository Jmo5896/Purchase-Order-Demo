import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import API from '../../../services/invite.service'

export default function InviteForm(props) {
  const [validated, setValidated] = useState(false)

  const onFormSubmit = async (e) => {
    e.preventDefault()

    const sendData = async (data) => {
      props.onHide()
      await API.resendInvite(data)
    }
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    } else {
      sendData(props.post)
    }
    setValidated(true)
  }

  const closeModal = () => {
    props.onHide()
    setValidated(false)
  }

  return (
    <>
      <h2>Are you sure you want to resend this Invite?</h2>
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <Button variant="success m-2" type="submit">
          Resend Invite
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Cancel
        </Button>
      </Form>
    </>
  )
}
