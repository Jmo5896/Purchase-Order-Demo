import React, { useState, useEffect } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'

import MyTable from '../../Table'
import MyRow from '../../Table/TRows/PurchaseRow'
import MyHeader from '../../Table/THeaders/PurchaseForm.header'
import API from '../../../services/poflow.service'
import Loading from '../../Loading'

export default function RejectRequestForm({ post, onHide }) {
  const [validated, setValidated] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [vendors, setVendors] = useState([])
  const [shippingHandling, setShippingHandling] = useState(post.shippingHandling)
  const [allData, setData] = useState([...post.data] || [])
  const reducer = (partialSum, a) => {
    return partialSum + a.total_price
  }
  const [grandTotal, setGrandTotal] = useState(post.data.reduce(reducer, 0) || 0)
  const [location, setLocation] = useState({
    reqId: post.poData.requisitionId,
    loc: post.poData.locationCode
  })
  const [flows, setFlows] = useState([])
  const propHistory = useHistory()

  const resetState = () => {
    setData([...post.data] || [])
    setShippingHandling(post.shippingHandling)
    setGrandTotal(post.data.reduce(reducer, 0) || 0)
    setLocation({
      reqId: post.poData.requisitionId,
      loc: post.poData.locationCode
    })
    setValidated(false)
  }

  useEffect(() => {
    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    let isMounted = true

    const fetchData = () => {
      // console.log(post)

      //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
      if (isMounted) {
        setData([...post.data])
        setShippingHandling(post.shippingHandling)
        setGrandTotal(post.data.reduce(reducer, 0))
        setLocation({
          reqId: post.poData.requisitionId,
          loc: post.poData.locationCode
        })
      }
    }
    if (post) {
      fetchData()
    }

    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    return () => {
      isMounted = false
    }
  }, [post, post.poData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.requestFormData()
        setLoading(false)
        setVendors(response.data.vendorList)
        setFlows(response.data.formFlows)
      } catch (err) {
        console.log(err)
        propHistory.push('/dashboard')
        window.location.reload()
      }
    }
    if (isLoading) {
      fetchData()
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

    let data = {
      formId: post.id,
      items: allData.map((obj) => {
        const tempObj = { ...obj }
        delete tempObj.id
        return tempObj
      }),
      requestFormData: {
        vendorId: formDataObj.vendorId,
        accountId: 0,
        shippingHandling: formDataObj.shippingHandling,
        rejected: false,
        reason: null
      }
    }
    if (formDataObj.quote.name) {
      data.requestFormData = await fileURLS(data.requestFormData, 'quote')
    }

    const sendData = async (data) => {
      onHide()
      await API.updateRejection(data)
      post.setLoading(true)
    }
    const form = e.target
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      resetState()
      sendData(data)
    }
  }

  const closeModal = () => {
    onHide()
    resetState()
  }

  const locationUpdate = (e) => {
    const val = e.target.value.split('|')

    setLocation({
      reqId: val[0],
      loc: val[1]
    })
  }

  return (
    <>
      {isLoading && <Loading />}
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <h3>{`Reject Reason: ${post.reason}`}</h3>
        <div className="row">
          <Form.Group className="col-6">
            <Form.Label>
              Department Selection: <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              required
              name="requisitionId"
              as="select"
              onChange={locationUpdate}
              defaultValue={`${location.reqId}|${location.loc}`}
            >
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
            <Select
              name="vendorId"
              className="override-input"
              options={vendors}
              defaultValue={
                vendors.filter((obj) => obj.value === post.poData.vendorId)[0]
              }
            />
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
            <button type="button" className="btn btn-secondary " onClick={addRow}>
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
              defaultValue={shippingHandling}
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
