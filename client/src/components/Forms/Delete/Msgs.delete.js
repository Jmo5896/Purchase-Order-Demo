import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import API from '../../../services/message.service'

export default function DeleteMessages({ post, onHide }) {
  const [validated, setValidated] = useState(false)

  const onFormSubmit = (e) => {
    e.preventDefault()

    const sendData = async () => {
      onHide()
      await API.deleteMsgs()
      post.setLoading(true)
    }
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      setValidated(false)
      sendData()
    }
  }

  const closeModal = () => {
    onHide()
    setValidated(false)
  }

  return (
    <>
      <h2>
        Do you want to empty your trash can (Messages clear out after 30 days of being in
        the trash can)?
      </h2>
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <Button variant="success m-2" type="submit">
          Empty Trash Can
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Cancel
        </Button>
      </Form>
    </>
  )
}
