import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import API from '../../../services/message.service'

export default function TrashMessage({ post, onHide }) {
  const [validated, setValidated] = useState(false)
  // console.log(post)
  const onFormSubmit = (e) => {
    e.preventDefault()

    const data = { ...post }
    const sendData = async (data) => {
      onHide()
      await API.updateTrash(data)
      post.setLoading(true)
    }
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      setValidated(false)
      sendData(data)
    }
  }

  const closeModal = () => {
    onHide()
    setValidated(false)
  }

  return (
    <>
      <h2>
        Do you want to move all selected messages to your{' '}
        {post.trash ? 'trash can' : 'inbox'}?
      </h2>
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <Button variant="success m-2" type="submit">
          Move message
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Cancel
        </Button>
      </Form>
    </>
  )
}
