import React, { useState, useEffect } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'

import MyTable from '../../Table'
import MyHeader from '../../Table/THeaders'
import MyRow from '../../Table/TRows/PODisplay.row'
import API from '../../../services/poflow.service'

export default function POApproveForm(props) {
  const [validated, setValidated] = useState(false)
  const [status, setStatus] = useState(false)
  const [overAllstatus, setoverAllstatus] = useState({ ...props.status })
  const [final, setFinal] = useState('')
  const [rejectMsg, setMsg] = useState(props.post.reason || '')

  const resetState = () => {
    setValidated(false)
    setStatus(false)
    setoverAllstatus(props.status)
    setMsg(props.post.reason || '')
    setFinal('')
  }

  useEffect(() => {
    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    let isMounted = true

    if (isMounted) {
      console.log(props.post.data)
      setoverAllstatus(props.status)
    }

    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    return () => {
      isMounted = false
    }
  }, [props])

  const onFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    let data = {
      id: props.post.id,
      approval: status,
      stage: props.status,
      switch: overAllstatus.switchName
        ? formDataObj[overAllstatus.switchName]
          ? formDataObj[overAllstatus.switchName] === 'true'
            ? true
            : false
          : overAllstatus.switch
        : null,
      reason: rejectMsg || null
    }

    const sendData = async (data) => {
      props.onHide()
      await API.status(data)
      props.post.setLoading(true)
    }
    const form = e.currentTarget
    if (
      form.checkValidity() === false ||
      !status ||
      (final !== 'approve' && !rejectMsg)
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

  const calculateTotal = (arr) => {
    const reducer = (previousValue, currentValue) => previousValue + currentValue
    const amounts = arr.map((obj) => obj.total_price)
    return amounts.reduce(reducer)
  }

  const approve_reject = (e) => {
    setStatus(e.target.id)
    setValidated(false)
  }

  const finalCheck = (e) => {
    setFinal(e.target.value)
  }

  const createMsg = (e) => {
    console.log(e.target.value)
    setMsg(e.target.value)
  }

  return (
    <>
      <h2>
        Purchase Order for:{' '}
        <strong style={{ color: 'black' }}>
          {props.status.approvalInfo.name} ({props.status.approvalInfo.email})
        </strong>
      </h2>
      <h3>
        Selected vendor:{' '}
        <strong style={{ color: 'black' }}>
          {props.status.approvalInfo.vendorName} ({props.status.approvalInfo.vendorId})
        </strong>
      </h3>
      <MyTable
        tData={props.post.data}
        sample={{ ...props.post.data[0] }}
        header={MyHeader}
        row={MyRow}
      />
      <h5> Shipping and Handling: ${props.post.shippingHandling}</h5>
      <h5>
        Grand total: $
        {props.post.data.length > 0 &&
          (calculateTotal(props.post.data) + props.post.shippingHandling).toFixed(2)}
      </h5>
      {props.post.quote && (
        <h5>
          A quote has been included. To view, click{' '}
          <a href={props.post.quote} target="_blank" rel="noreferrer">
            here
          </a>
          .
        </h5>
      )}
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        {overAllstatus.switch === null && overAllstatus.switchName && (
          <fieldset>
            <Form.Group className="mb-3">
              <Form.Label as="legend" column sm={2}>
                Will this purchase order be for {overAllstatus.switchName} or county?
                <span style={{ color: 'red' }}>*</span>
              </Form.Label>

              <Form.Check
                type="radio"
                label={<span style={{ color: 'black' }}>{overAllstatus.switchName}</span>}
                name={overAllstatus.switchName}
                value={true}
                id={overAllstatus.switchName}
              />
              <Form.Check
                type="radio"
                label={<span style={{ color: 'black' }}>County</span>}
                name={overAllstatus.switchName}
                value={false}
                id="county"
              />
            </Form.Group>
          </fieldset>
        )}
        <fieldset>
          <Form.Group className="mb-3" onChange={approve_reject}>
            <Form.Label as="legend" column sm={2}>
              <strong style={{ color: 'black' }}>
                Approve or Reject: <span style={{ color: 'red' }}>*</span>
              </strong>
            </Form.Label>

            <Form.Check
              type="radio"
              label={<span style={{ color: 'black' }}>Approve</span>}
              name="approveReject"
              id="approve"
            />
            <Form.Check
              type="radio"
              label={<span style={{ color: 'black' }}>Reject</span>}
              name="approveReject"
              id="reject"
            />
          </Form.Group>
        </fieldset>
        <Form.Group className="col-6 right noteblock mr-3 pr-3">
          <Form.Label>
            {status === 'reject' ? (
              <strong style={{ color: 'black' }}>
                Give a reason for rejection to continue.
                <span style={{ color: 'red' }}>*</span>
              </strong>
            ) : (
              <strong style={{ color: 'black' }}>Notes about this purchase order.</strong>
            )}
          </Form.Label>
          <Form.Control
            onChange={createMsg}
            style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'white' }} //TURNS OFF FORM VALIDATION
            name="rejectMsg"
            as="textarea"
            defaultValue={status === 'reject' ? '' : rejectMsg}
            rows={4}
            cols={50}
            maxLength={500}
          />
          <p>{rejectMsg.length}/500</p>
        </Form.Group>
        {status === 'approve' && (
          <>
            <Form.Group className="col-4">
              <Form.Label>
                <strong style={{ color: 'black' }}>
                  Type the word "approve" to continue.
                  <span style={{ color: 'red' }}>*</span>
                </strong>
              </Form.Label>
              <Form.Control
                onChange={finalCheck}
                name="finalApproval"
                as="input"
                style={{ borderColor: 'rgba(0,0,0,0.2)', background: 'white' }} //TURNS OFF FORM VALIDATION
                maxLength={7}
                autoComplete="off"
              />
            </Form.Group>
          </>
        )}
        {validated && (
          <Alert variant="danger">
            Missing required fields or nothing has been entered.
          </Alert>
        )}
        <Button variant="success m-2" type="submit">
          Submit
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Cancel
        </Button>
      </Form>
    </>
  )
}
