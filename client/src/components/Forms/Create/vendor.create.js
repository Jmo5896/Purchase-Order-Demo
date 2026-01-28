import React, { useEffect, useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'

import API from '../../../services/poflow.service'
import loading from '../../../imgs/circlesLoading.gif'

export default function AddVendorForm(props) {
  const [validated, setValidated] = useState(false)
  const [nameCheck, setNameCheck] = useState({ value: '', valid: false })
  const [idCheck, setIdCheck] = useState({ value: '', valid: false })
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  let timeDelay

  const resetState = () => {
    setValidated(false)
    setNameCheck({ value: '', valid: false })
    setIdCheck({ value: '', valid: false })
    setLoading(false)
    setError(false)
    clearTimeout(timeDelay)
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
      vendorId: idCheck.value,
      name: nameCheck.value,
      address: formDataObj.address,
      cityStateZip: `${formDataObj.city}, ${formDataObj.state} ${formDataObj.zip}`
    }

    const sendData = async (data) => {
      try {
        await API.createVendor(data)
        props.onHide()
        props.post.setLoading(true)
        resetState()
      } catch (err) {
        setError(true)
      }
    }
    const form = e.target
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
    resetState()
  }

  const handleOnChange = (e) => {
    clearTimeout(timeDelay)
    timeDelay = setTimeout(() => {
      const nameOrId = e.target.name
      const val = e.target.value
      if (nameOrId === 'name') {
        setLoading(true)
        setNameCheck({ ...nameCheck, value: val.toUpperCase() })
      } else {
        setLoading(true)
        setIdCheck({ ...idCheck, value: parseInt(val) })
      }
    }, 1000)
  }

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await API.checkVendor({ name: nameCheck.value })
        if (isMounted) {
          setNameCheck({ ...nameCheck, valid: !response.data.exists })
          setLoading(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (nameCheck.value && isLoading) {
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [nameCheck.value])

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await API.checkVendor({ vendorId: idCheck.value })
        if (isMounted) {
          setIdCheck({ ...idCheck, valid: !response.data.exists })
          setLoading(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (idCheck.value && isLoading) {
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [idCheck.value])

  return (
    <>
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <div className="row">
          <Form.Group className="col-sm-12 col-lg-4">
            <Form.Label>
              Vendor Name:{' '}
              {isLoading ? (
                <img src={loading} width="25" alt="loading gif" />
              ) : nameCheck.valid ? (
                <span>&#9989;</span>
              ) : (
                <span>&#10060;</span>
              )}
            </Form.Label>
            <Form.Control
              required
              onChange={handleOnChange}
              name="name"
              as="input"
              maxLength={50}
            />
          </Form.Group>

          <Form.Group className="col-sm-12 col-lg-4">
            <Form.Label>
              Vendor ID:{' '}
              {isLoading ? (
                <img src={loading} width="25" alt="loading gif" />
              ) : idCheck.valid ? (
                <span>&#9989;</span>
              ) : (
                <span>&#10060;</span>
              )}
            </Form.Label>
            <Form.Control
              required
              onChange={handleOnChange}
              name="vendorId"
              as="input"
              type="number"
            />
          </Form.Group>
        </div>
        {nameCheck.valid && idCheck.valid && nameCheck.value && idCheck.value ? (
          <div className="row">
            <Form.Group className="col-sm-12 col-lg-12">
              <Form.Label>
                Address: <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control required name="address" as="input" maxLength={100} />
            </Form.Group>

            <Form.Group className="col-sm-12 col-lg-4">
              <Form.Label>
                City: <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control required name="city" as="input" maxLength={33} />
            </Form.Group>
            <Form.Group className="col-sm-12 col-lg-4">
              <Form.Label>
                State: <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control required name="state" as="input" maxLength={33} />
            </Form.Group>
            <Form.Group className="col-sm-12 col-lg-4">
              <Form.Label>
                Zip Code: <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control required name="zip" as="input" type="number" />
            </Form.Group>
          </div>
        ) : (
          <h4>Vendor Name or Vendor Id already exist.</h4>
        )}
        {validated && (
          <Alert variant="danger">
            Missing required fields or nothing has been entered.
          </Alert>
        )}
        {error && <Alert variant="danger">An error has occured.</Alert>}
        <Button variant="success m-2" type="submit" onClick={checkEntry}>
          Submit
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Exit
        </Button>
      </Form>
    </>
  )
}
