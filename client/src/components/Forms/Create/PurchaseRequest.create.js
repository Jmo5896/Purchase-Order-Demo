import React, { useState, useEffect } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import Select from 'react-select'

import MyTable from '../../Table'
import MyRow from '../../Table/TRows/PurchaseRow'
import MyHeader from '../../Table/THeaders/PurchaseForm.header'
import API from '../../../services/poflow.service'
import Loading from '../../Loading'

export default function PurchaseRequestForm(props) {
  const [validated, setValidated] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [vendors, setVendors] = useState([])
  const [flows, setFlows] = useState([])
  const [shippingHandling, setShippingHandling] = useState(0.0)
  const [allData, setData] = useState([
    {
      quantity: 0.0,
      item_name: '',
      description: '',
      unit_price: 0.0,
      total_price: 0.0
    }
  ])
  const [grandTotal, setGrandTotal] = useState(0)

  const resetState = () => {
    setVendors([])
    setShippingHandling(0.0)
    setData([
      {
        quantity: 0.0,
        item_name: '',
        description: '',
        unit_price: 0.0,
        total_price: 0.0
      }
    ])
    setGrandTotal(0)
    setValidated(false)
  }

  useEffect(() => {
    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await API.requestFormData()
        //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
        if (isMounted) {
          setLoading(false)
          setVendors(response.data.vendorList)
          setFlows(response.data.formFlows)
        }
      } catch (err) {
        console.log(err)
        // props.history.push('/login')
        // window.location.reload()
      }
    }
    if (isLoading) {
      fetchData()
    }

    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    return () => {
      isMounted = false
    }
  }, [isLoading])

  const updateFields = (i, k, v) => {
    const currentData = [...allData]
    if (typeof v === 'string') {
      currentData[i][k] = v || currentData[i][k]
    } else {
      currentData[i][k] = v.label || currentData[i][k]
      currentData[i]['vendorId'] = v.value || currentData[i][k]
    }
    if (currentData[i][k] !== allData[i][k]) {
      setData(currentData)
    }
  }

  function round(num) {
    const m = Number((Math.abs(num) * 100).toPrecision(15))
    return (Math.round(m) / 100) * Math.sign(num)
  }

  const updateTotal = (i, k, v) => {
    const currentData = [...allData]
    const k2 = k === 'quantity' ? 'unit_price' : 'quantity'
    currentData[i][k] = parseFloat(v || currentData[i][k])
    currentData[i].total_price = round(currentData[i][k] * currentData[i][k2])
    setData(currentData)
    updateGrandTotal(currentData)
  }
  const updateGrandTotal = (data) => {
    let total = 0
    data.forEach((obj) => {
      if (typeof obj.total_price == 'number') {
        total += obj.total_price
      }
    })
    setGrandTotal(total)
  }

  const addRow = () => {
    const currentData = [...allData]
    currentData.push({
      quantity: 0.0,
      item_name: '',
      description: '',
      unit_price: 0.0,
      total_price: 0.0
    })
    setData(currentData)
  }

  const deleteRow = (i) => {
    const currentData = [...allData]
    if (currentData.length > 1) {
      currentData.splice(i, 1)
      setData(currentData)
      updateGrandTotal(currentData)
    }
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    setValidated(false)

    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

    const fileURLS = async (data, keyName) => {
      const newData = { ...data }
      const fileData = new FormData()
      const newName = formDataObj[keyName].name
        .split('')
        .map((char) =>
          char === ' ' || char === '&' || char === '%' || char === '#' ? '_' : char
        )
        .join('')
      fileData.append('media', formDataObj[keyName], newName)
      setLoading(true)
      const file = await API.media(fileData, keyName)
      newData[keyName] = file.data
      return newData
    }

    const ids = formDataObj.requisitionId.split('|')
    let data = {
      id: {
        requisitionId: ids[0],
        locationCode: ids[1]
      },
      accountId: 0,
      vendorId: parseInt(formDataObj.vendorId),
      shippingHandling: parseFloat(formDataObj.shippingHandling),
      items: allData
    }
    if (formDataObj.quote.name) {
      data = await fileURLS(data, 'quote')
    }

    const sendData = async (data) => {
      props.onHide()
      await API.create(data)
      props.post.setLoading(true)
      setLoading(true)
    }
    const form = e.target
    if (form.checkValidity() === false || !data.vendorId) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      resetState()
      sendData(data)
    }
  }

  const reload = () => window.location.reload()

  const closeModal = () => {
    props.onHide()
    resetState()
    reload()
  }

  return (
    <>
      {isLoading && <Loading />}
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <div className="row">
          <Form.Group className="col-6">
            <Form.Label>
              Department Selection: <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control required name="requisitionId" as="select">
              <option value="">Select the department...</option>
              {flows.map((obj, i) => (
                <option key={i} value={`${obj.requisitionId}|${obj.locationCode}`}>
                  {obj.requisitionId}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="col-12">
            <Form.Label>
              Vendor Selection: <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Select name="vendorId" className="override-input" options={vendors} />
          </Form.Group>

          <Form.Group className="col-12">
            <MyTable
              tData={allData}
              sample={{ ...allData[0] }}
              header={MyHeader}
              row={MyRow}
              purchaseFuncs={{
                updateTotal,
                updateFields,
                deleteRow
              }}
            />
          </Form.Group>
          <Form.Group className="col-2">
            <button type="button" className="btn btn-secondary" onClick={addRow}>
              Add Item
            </button>
          </Form.Group>
        </div>
        <div className="row">
          <Form.Group className="col-6">
            <Form.Label>
              Shipping and Handling Cost: <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              required
              type="number"
              step={0.01}
              onChange={(e) => setShippingHandling(parseFloat(e.target.value))}
              name="shippingHandling"
              placeholder="00.00"
            />
          </Form.Group>

          <Form.Group className="col-6">
            <Form.Label htmlFor="quote-upload">Upload a quote (image or pdf):</Form.Label>
            <Form.Control
              name="quote"
              type="file"
              className="form-control-file"
              id="quote-upload"
              isValid={true}
            />
          </Form.Group>
          <div className="col-10">
            <h5>
              Grand Total:{' '}
              <span>
                ${(parseFloat(grandTotal) + parseFloat(shippingHandling)).toFixed(2)}
              </span>
            </h5>
          </div>
        </div>
        {validated && (
          <Alert variant="danger">
            Missing required fields or nothing has been entered.
          </Alert>
        )}
        <Button variant="success m-2" type="submit">
          Submit
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Exit
        </Button>
      </Form>
    </>
  )
}
