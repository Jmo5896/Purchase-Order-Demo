import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'

import API from '../../../services/poflow.service'

export default function PriorityApprovalForm(props) {
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
      email: formDataObj.email,
      order: props.post.order,
      finance: formDataObj.finance === 'true' ? true : false
    }

    const sendData = async (data) => {
      props.onHide()
      await API.createPriorityApproval(data)
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

      <fieldset>
        <Form.Group className="mb-3">
          <Form.Label as="legend" column sm={2}>
            Pick Approver or Finance:
            <span style={{ color: 'red' }}>*</span>
          </Form.Label>

          <Form.Check
            type="radio"
            label={<span style={{ color: 'black' }}>Finance</span>}
            name="finance"
            value={true}
            id="finance"
          />
          <Form.Check
            type="radio"
            label={<span style={{ color: 'black' }}>Approver</span>}
            name="finance"
            value={false}
            id="approver"
          />
        </Form.Group>
      </fieldset>

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
