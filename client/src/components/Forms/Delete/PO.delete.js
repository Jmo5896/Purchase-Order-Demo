import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import API from '../../../services/poflow.service'

export default function DeletePoForm(props) {
  const [validated, setValidated] = useState(false)

  const onFormSubmit = (e) => {
    e.preventDefault()

    const data = {
      formId: props.post.id
    }
    const sendData = async (data) => {
      props.onHide()
      await API.delete(data)
      props.post.setLoading(true)
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
    props.onHide()
    setValidated(false)
  }

  return (
    <>
      <h2>Are you sure you want to delete this purchase order?</h2>
      <h4>Date: {props.status.date}</h4>
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <Button variant="success m-2" type="submit">
          Delete purchase order
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Cancel
        </Button>
      </Form>
    </>
  )
}
