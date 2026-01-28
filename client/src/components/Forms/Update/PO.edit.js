import React, { useState, useEffect } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import Select from 'react-select'

import MyTable from '../../Table'
import MyRow from '../../Table/TRows/PurchaseRow'
import MyHeader from '../../Table/THeaders/PurchaseForm.header'
import API from '../../../services/poflow.service'

export default function POEditForm({ post, status, onHide }) {
  const [validated, setValidated] = useState(false)
  const [vendors, setVendors] = useState([])
  const [accounts, setAccounts] = useState({})
  const [selectedVendor, setSelectedVendor] = useState(
    {
      value: post.poData.vendorId,
      label: post.poData.vendorName
    } || {}
  )
  const [selectedAccount, setSelectedAccount] = useState(
    {
      value: post.poData.accountId,
      label: post.poData.description,
      accountCode: post.poData.accountCode
    } || {}
  )
  const [selectedAddress, setSelectedAddress] = useState([])
  const [allData, setData] = useState([...post.data] || [])
  const reducer = (partialSum, a) => {
    return partialSum + a.total_price
  }
  const [grandTotal, setGrandTotal] = useState(post.data.reduce(reducer, 0) || 0)
  const [shippingHandling, setShippingHandling] = useState(post.shippingHandling || 0.0)

  const resetState = () => {
    setValidated(false)
    setSelectedVendor({
      value: post.poData.vendorId,
      label: post.poData.vendorName
    })
    setSelectedAccount({
      value: post.poData.accountId,
      label: post.poData.description,
      accountCode: post.poData.accountCode
    })
    setData(
      [
        ...post.data.map((obj) => {
          return {
            id: obj.id,
            quantity: obj.quantity,
            item_name: obj.item_name,
            description: obj.description,
            unit_price: obj.unit_price,
            total_price: obj.total_price
          }
        })
      ] || []
    )
    setGrandTotal(post.data.reduce(reducer, 0) || 0)
    setShippingHandling(post.shippingHandling || 0.0)
  }

  useEffect(() => {
    let isMounted = true

    const fetchData = () => {
      if (isMounted) {
        setData([
          ...post.data.map((obj) => {
            return {
              id: obj.id,
              quantity: obj.quantity,
              item_name: obj.item_name,
              description: obj.description,
              unit_price: obj.unit_price,
              total_price: obj.total_price
            }
          })
        ])
        setVendors([{ value: 0, label: 'VENDOR OVERRIDE' }, ...post.poData.vendors])
        setAccounts([
          { value: 0, label: 'ACCOUNT OVERRIDE', accountCode: '0.0.0.0.0' },
          ...post.poData.accounts
        ])
        setSelectedVendor({
          value: post.poData.vendorId,
          label: post.poData.vendorName
        })
        setSelectedAccount({
          value: post.poData.accountId,
          label: post.poData.description,
          accountCode: post.poData.accountCode
        })
        setShippingHandling(post.shippingHandling)
        setGrandTotal(post.data.reduce(reducer, 0))
      }
    }
    if (post) {
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [post, post.poData])

  useEffect(() => {
    const fetchData = async () => {
      const response = await API.getAddresses({
        vendorId: selectedVendor.value && selectedVendor.value
      })
      setSelectedAddress(response.data)
    }
    if (selectedVendor.value !== 0) {
      fetchData()
    } else {
      setSelectedAddress([])
    }
  }, [selectedVendor])

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
    let data
    let sendData
    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())
    data = {
      formId: post.id,
      items: allData.map((obj) => {
        return {
          rowId: obj.id,
          item_name: obj.item_name,
          description: obj.description,
          unit_price: obj.unit_price,
          quantity: obj.quantity,
          total_price: obj.total_price
        }
      }),
      requestFormData: {
        poNumber: parseInt(formDataObj.poNumber),
        shippingHandling: shippingHandling,
        approvalLevel: status.level + 1,
        addressId: formDataObj.address
      }
    }
    if (selectedVendor.value !== post.poData.vendorId) {
      data.requestFormData.vendorId = selectedVendor.value
    }

    if (selectedAccount.value !== post.poData.accountId) {
      data.requestFormData.accountId = selectedAccount.value
    }

    if (formDataObj.overrideAccountName) {
      data.requestFormData.override_account = `${formDataObj.overrideAccountName}|${formDataObj.overrideAccountCode}`
      data.requestFormData.accountId = 0
    }

    if (formDataObj.overrideVendorName) {
      data.requestFormData.override_vendor = `${formDataObj.overrideVendorName}|${formDataObj.overrideVendorCode}|${formDataObj.overrideVendorAddress}|${formDataObj.overrideVendorcityStateZip}`
      data.requestFormData.vendorId = 0
      data.requestFormData.addressId = null
    }

    sendData = async (data) => {
      onHide()
      await API.updateForm(data)
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

  return (
    <>
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <h3 onClick={() => console.log(post.poData)}>Name: {post.poData.name}</h3>
        <div className="row">
          <div className="col-6">
            <Form.Group>
              <Form.Label>
                <h4>
                  <b>
                    Vendor (code: {selectedVendor.value}):{' '}
                    <span style={{ color: 'red' }}>*</span>
                  </b>
                </h4>
              </Form.Label>
              <Select
                name="vendor"
                options={vendors}
                defaultValue={{
                  label: post.poData.vendorName,
                  value: post.poData.vendorId
                }}
                onChange={setSelectedVendor}
              />
            </Form.Group>
            {selectedVendor.value === 0 && (
              <div className="row">
                <Form.Group className="col-6">
                  <Form.Label>
                    <h6>
                      Override vendor name: <span style={{ color: 'red' }}>*</span>
                    </h6>
                  </Form.Label>
                  <Form.Control
                    required
                    maxLength={60}
                    name="overrideVendorName"
                    defaultValue={post.poData.override.overrideVendorName || ''}
                  />
                </Form.Group>
                <Form.Group className="col-6">
                  <Form.Label>
                    <h6>
                      Override vendor code: <span style={{ color: 'red' }}>*</span>
                    </h6>
                  </Form.Label>
                  <Form.Control
                    required
                    maxLength={60}
                    name="overrideVendorCode"
                    defaultValue={post.poData.override.overrideVendorCode || ''}
                  />
                </Form.Group>
                <Form.Group className="col-6">
                  <Form.Label>
                    <h6>
                      Override vendor Address: <span style={{ color: 'red' }}>*</span>
                    </h6>
                  </Form.Label>
                  <Form.Control
                    required
                    maxLength={60}
                    name="overrideVendorAddress"
                    defaultValue={post.poData.override.overrideVendorAddress || ''}
                  />
                </Form.Group>
                <Form.Group className="col-6">
                  <Form.Label>
                    <h6>
                      Override vendor city, state, and zip:{' '}
                      <span style={{ color: 'red' }}>*</span>
                    </h6>
                  </Form.Label>
                  <Form.Control
                    required
                    maxLength={60}
                    name="overrideVendorcityStateZip"
                    defaultValue={post.poData.override.overrideVendorcityStateZip || ''}
                  />
                </Form.Group>
              </div>
            )}
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label>
                <h4>
                  <b>
                    Account (code: {selectedAccount.accountCode}):{' '}
                    <span style={{ color: 'red' }}>*</span>
                  </b>
                </h4>
              </Form.Label>
              <Select
                name="account"
                options={accounts}
                defaultValue={{
                  label: post.poData.description,
                  value: post.poData.accountId,
                  accountCode: post.poData.accountCode
                }}
                onChange={setSelectedAccount}
              />
            </Form.Group>
            {selectedAccount.value === 0 && (
              <>
                <Form.Group>
                  <Form.Label>
                    <h6>
                      Override account name: <span style={{ color: 'red' }}>*</span>
                    </h6>
                  </Form.Label>
                  <Form.Control
                    required
                    maxLength={240}
                    name="overrideAccountName"
                    defaultValue={post.poData.override.overrideAccountName || ''}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    <h6>
                      Override account code: <span style={{ color: 'red' }}>*</span>
                    </h6>
                  </Form.Label>
                  <Form.Control
                    required
                    maxLength={240}
                    name="overrideAccountCode"
                    defaultValue={post.poData.override.overrideAccountCode || ''}
                  />
                </Form.Group>
              </>
            )}
          </div>

          <Form.Group className="col-12">
            <MyTable
              tData={allData}
              sample={{ ...allData[0] }}
              header={MyHeader}
              row={MyRow}
              purchaseFuncs={{
                updateTotal,
                updateFields,
                deleteRow,
                Select: (func, d) => (
                  <Select
                    className="override-input"
                    options={vendors}
                    onChange={func}
                    defaultInputValue={d}
                  />
                )
              }}
            />
          </Form.Group>

          <Form.Group className="col-6 center">
            <Form.Label>
              <strong style={{ color: 'black' }}>
                Shipping and Handling Cost: <span style={{ color: 'red' }}>*</span>
              </strong>
            </Form.Label>
            <Form.Control
              required
              type="number"
              step={0.01}
              onChange={(e) => setShippingHandling(parseFloat(e.target.value))}
              name="shippingHandling"
              placeholder="00.00"
              defaultValue={post.shippingHandling}
            />
          </Form.Group>

          <Form.Group className="col-4 center">
            <Form.Label>
              <strong style={{ color: 'black' }}>
                Purchase Order Number: <span style={{ color: 'red' }}>*</span>
              </strong>
            </Form.Label>
            <Form.Control required name="poNumber" maxLength={5} />
          </Form.Group>
        </div>

        <div className="row">
          {selectedAddress.length > 0 && (
            <Form.Group className="col-4 center">
              <Form.Label as="legend">
                <strong style={{ color: 'black' }}>
                  Select an address for purchase order:
                  <span style={{ color: 'red' }}>*</span>
                </strong>{' '}
              </Form.Label>

              {selectedAddress.map((obj, i) => (
                <Form.Check
                  key={i}
                  type="radio"
                  label={
                    <>
                      {obj.secondName && (
                        <>
                          {obj.secondName}
                          <br />
                        </>
                      )}
                      {obj.address}
                      <br />
                      {obj.cityStateZip}
                      <br />
                    </>
                  }
                  name="address"
                  value={obj.nanoId}
                  id={obj.nanoId}
                />
              ))}
            </Form.Group>
          )}

          <div className="col-4 center">
            <h5>
              <strong style={{ color: 'black' }}>
                Grand Total:{' '}
                <span>
                  ${(parseFloat(grandTotal) + parseFloat(shippingHandling)).toFixed(2)}
                </span>
              </strong>
            </h5>
          </div>
        </div>
        {post.quote && (
          <h5 className="col-12">
            A quote has been included. To view, click{' '}
            <a href={post.quote} target="_blank" rel="noreferrer">
              here
            </a>
            .
          </h5>
        )}
        {post.reason && (
          <>
            <h5 className="col-12">NOTE ABOUT PURCHASE ORDER:</h5>
            <p>{post.reason}</p>
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
          Exit
        </Button>
      </Form>
    </>
  )
}
