import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import API from '../../../services/poflow.service'

export default function DeletePriorityApprovalForm(props) {
  const [validated, setValidated] = useState(false)

  const onFormSubmit = (e) => {
    e.preventDefault()

    const data = {
      id: props.post.id
    }
    const sendData = async (data) => {
      props.onHide()
      await API.deletePriorityApproval(data)
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
      <h2>Are you sure you want to delete this Priority Approver?</h2>
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <Button variant="success m-2" type="submit">
          Delete Priority Approver
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Cancel
        </Button>
      </Form>
    </>
  )
}
