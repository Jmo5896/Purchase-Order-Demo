import React, { useState, useEffect } from 'react'
import { Button, Form, Alert, Row, Col } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Select from 'react-select'
import trashIcon from 'bootstrap-icons/icons/trash-fill.svg'

import API from '../../../services/poflow.service'

export default function CreateFlowForm(props) {
  const [validated, setValidated] = useState(false)
  const [content, setContent] = useState({
    switchTrue: [],
    switchFalse: []
  })
  const [emails, setEmails] = useState([])
  const [approver, setApprover] = useState('')
  const [newSwitch, setSwitch] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [approvalEmails, setApprovalEmails] = useState([])
  const [initialApprover, setInitialApprover] = useState(null)

  const stateReset = () => {
    setValidated(false)
    setContent({
      switchTrue: [],
      switchFalse: []
    })
    setApprover('')
    setSwitch(false)
    setEmails([])
    setInitialApprover(null)
  }

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await API.getApprovalEmails()
        console.log(response.data)

        if (isMounted) {
          setLoading(false)
          setApprovalEmails(response.data)
        }
      } catch (err) {
        console.log(err)
        // propHistory.push('/login')
        // window.location.reload()
      }
    }
    if (isLoading) {
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [isLoading])

  const radioSelect = (e) => {
    setSwitch(e.target.value === 'true' ? true : false)
  }

  // reorder lists for onDragEnd
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result.map((obj, i) => {
      obj.order = i + 1
      return obj
    })
  }

  // Move item from one list to other
  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)

    destClone.splice(droppableDestination.index, 0, removed)

    const result = {}
    result[droppableSource.droppableId] = sourceClone.map((obj, i) => {
      obj.order = i + 1
      return obj
    })
    result[droppableDestination.droppableId] = destClone.map((obj, i) => {
      obj.order = i + 1
      return obj
    })

    return result
  }

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: 10 * 2,
    margin: `0 0 ${10}px 0`,
    background: isDragging ? 'lightgreen' : 'grey',

    ...draggableStyle
  })

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: 10,
    width: 250
  })

  const onDragEnd = (results) => {
    // obj with to keys, switchTrue & switchFalse
    const newContent = { ...content }
    // function to retrieve list
    const getList = (id) => newContent[id]
    // separates source and destinations for dragging
    const { destination, source } = results

    if (!destination) {
      return false
    }

    // sorting same list
    if (source.droppableId === destination.droppableId) {
      const currentItems = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      )

      //HARD CODED ID
      if (source.droppableId === 'switchFalse') {
        newContent.switchFalse = currentItems
      } else {
        newContent.switchTrue = currentItems
      }
      setContent(newContent)
    } else {
      // InterColumn movement
      const endResult = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      )
      setContent(endResult)
    }
  }

  const addApprover = (e) => {
    const es = [...emails]
    // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(approver)) {
    if (approver !== initialApprover) {
      const c = { ...content }
      es.push(approver)
      if (c.switchTrue.length > 0) {
        c.switchTrue.push({
          email: approver,
          order: c.switchTrue.length + 1
        })
      } else {
        c.switchTrue.push({
          email: approver,
          order: 1
        })
      }
      setEmails(es)
      setContent(c)
      setApprover('')
      setValidated(false)
    } else {
      setValidated(true)
    }
  }

  const captureVal = (e) => {
    const currentEmail = e.value
    console.log(currentEmail)
    if (currentEmail) {
      setApprover(currentEmail)
    }
  }

  const initialApproverCapture = (e) => {
    const currentEmail = e.value
    console.log(approvalEmails.filter((obj) => obj.value !== currentEmail))
    console.log(approvalEmails)
    console.log(currentEmail)
    if (currentEmail) {
      setInitialApprover(currentEmail)
    }
  }

  const removeDragItem = (event) => {
    const [col, tempEmail] = event.target.id.split('|')
    const c = { ...content }
    const es = [...emails]

    const e = c[col].find((obj) => obj.email === tempEmail)
    const index1 = c[col].indexOf(e)
    const index2 = es.indexOf(tempEmail)
    if (index2 > -1) {
      es.splice(index2, 1)
      setEmails(es)
    }
    if (index1 > -1) {
      c[col].splice(index1, 1)
      setContent(c)
    }
  }

  const checkEntry = (e) => {
    const userInput = e.target.value.toUpperCase().trim()
    if (props.post.reqIds.includes(userInput)) {
      setValidated(true)
    } else {
      setValidated(false)
    }
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    let formDataObj = Object.fromEntries(formData.entries())

    let tempArray
    if (formDataObj.initialApprover) {
      tempArray = [
        {
          email: initialApprover,
          // email: formDataObj.initialApprover.trim(),
          order: 1,
          switch: null
        }
      ]

      for (const key in content) {
        if (key === 'switchTrue') {
          content[key].forEach((obj) => {
            tempArray.push({
              email: obj.email.trim(),
              order: obj.order + 1,
              switch: true
            })
          })
        } else {
          content[key].forEach((obj) => {
            tempArray.push({
              email: obj.email.trim(),
              order: obj.order + 1,
              switch: false
            })
          })
        }
      }
    } else {
      tempArray = [...content.switchTrue]
    }

    const data = {
      requisitionId: formDataObj.requisitionId.trim(),
      locationCode: formDataObj.locationCode || '',
      switch: formDataObj.switch || null,
      address: `${formDataObj.buildingName}|${formDataObj.buildingAddress}|${formDataObj.cityStateZip}`,
      approvers: tempArray
    }

    const sendData = async (data) => {
      props.onHide()
      console.log(data)
      // await API.createApproval(data)
      props.post.setLoading(true)
    }
    const form = e.currentTarget
    const switchYes = form.querySelector("input#yes[type='radio']").checked
    if (
      form.checkValidity() === false ||
      content.switchTrue.length <= 0 ||
      props.post.reqIds.includes(data.requisitionId.toUpperCase()) ||
      (switchYes && content.switchFalse.length <= 0)
    ) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      sendData(data)
      stateReset()
    }
  }

  const closeModal = () => {
    props.onHide()
    stateReset()
  }

  return (
    <Form noValidate validated={validated} onSubmit={onFormSubmit}>
      <Form.Group>
        <Form.Label>
          <h6>
            Flow Name: <span style={{ color: 'red' }}>*</span>
          </h6>
        </Form.Label>
        <Form.Control
          required
          onChange={checkEntry}
          name="requisitionId"
          placeholder="dchs"
          maxLength={35}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>
          <h6>Location Code:</h6>
        </Form.Label>
        <Form.Control type="text" name="locationCode" placeholder="001" />
      </Form.Group>

      <div className="row">
        <Form.Group className="col-12">
          <Form.Label>
            <h6>
              Building Name: <span style={{ color: 'red' }}>*</span>
            </h6>
          </Form.Label>
          <Form.Control required name="buildingName" />
        </Form.Group>
        <Form.Group className="col-6">
          <Form.Label>
            <h6>
              Building Address: <span style={{ color: 'red' }}>*</span>
            </h6>
          </Form.Label>
          <Form.Control required name="buildingAddress" />
        </Form.Group>
        <Form.Group className="col-6">
          <Form.Label>
            <h6>
              Building city, state, and zip: <span style={{ color: 'red' }}>*</span>
            </h6>
          </Form.Label>
          <Form.Control required name="cityStateZip" />
        </Form.Group>
      </div>

      <fieldset>
        <Form.Group className="mb-3" onChange={radioSelect}>
          <Form.Label as="legend" column sm={2}>
            Do you want to add a switch to this flow?
          </Form.Label>

          <Form.Check
            type="radio"
            label={<span style={{ color: 'black' }}>Yes</span>}
            name="yesNo"
            value={true}
            id="yes"
          />
          <Form.Check
            type="radio"
            label={<span style={{ color: 'black' }}>No</span>}
            name="yesNo"
            value={false}
            id="no"
          />
        </Form.Group>
      </fieldset>

      {newSwitch ? (
        <>
          <Form.Group>
            <Form.Label>
              Name your flow switch:<span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control maxLength={50} required name="switch" placeholder="local" />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Who will be your intial approver (They will pick the direction of the flow):
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            {/* <Form.Control required name="initialApprover" placeholder="email@k12.wv.us" /> */}
            <Select
              name="initialApprover"
              className="override-input"
              options={approvalEmails}
              onChange={initialApproverCapture}
            />
          </Form.Group>

          <h5> Add approvers to each switch: </h5>
          {/* <input name="other" type="text" onChange={captureVal} value={approver} /> */}
          <Select
            name="other"
            className="override-input"
            options={
              initialApprover
                ? approvalEmails.filter((obj) => obj.value !== initialApprover)
                : approvalEmails
            }
            onChange={captureVal}
          />
          <button type="button" onClick={addApprover} className="btn-md btn-success m-2">
            add
          </button>

          <DragDropContext onDragEnd={onDragEnd}>
            <Row>
              <Col>
                <h6>If the switch is selected: </h6>
                <Droppable droppableId="switchTrue">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {content &&
                        content.switchTrue.map((temp, i) => (
                          <Draggable
                            key={i}
                            index={i}
                            draggableId={`order_index-${temp.email}-${temp.order}`}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {temp.email}
                                <div
                                  alt="delete user"
                                  className="icon trashcan"
                                  onClick={removeDragItem}
                                  id={`switchTrue|${temp.email}`}
                                  style={{
                                    backgroundImage: `url(${trashIcon})`,
                                    width: 20,
                                    height: 20
                                  }}
                                ></div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
              <Col>
                <h6>If the switch is NOT selected: </h6>
                <Droppable droppableId="switchFalse">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {content &&
                        content.switchFalse.map((temp, i) => (
                          <Draggable
                            key={i}
                            index={i}
                            draggableId={`order_index-${temp.email}-${temp.order}`}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {temp.email}
                                <div
                                  alt="delete user"
                                  className="icon"
                                  onClick={removeDragItem}
                                  id={`switchFalse|${temp.email}`}
                                  style={{
                                    backgroundImage: `url(${trashIcon})`,
                                    width: 20,
                                    height: 20
                                  }}
                                ></div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
            </Row>
          </DragDropContext>
        </>
      ) : (
        <>
          <h5> add flow approver(s): </h5>
          {/* <input name="other" type="text" onChange={captureVal} value={approver} /> */}
          <Select
            name="other"
            className="override-input"
            options={
              initialApprover
                ? approvalEmails.filter((obj) => obj.value !== initialApprover)
                : approvalEmails
            }
            onChange={captureVal}
          />
          <button type="button" onClick={addApprover} className="btn btn-success m-2">
            add
          </button>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="switchTrue">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {content &&
                    content.switchTrue.map((temp, i) => (
                      <Draggable
                        key={i}
                        index={i}
                        draggableId={`order_index-${temp.email}-${temp.order}`}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {temp.email}
                            <div
                              alt="delete user"
                              className="icon trashcan"
                              onClick={removeDragItem}
                              id={`switchTrue|${temp.email}`}
                              style={{
                                backgroundImage: `url(${trashIcon})`,
                                width: 20,
                                height: 20
                              }}
                            ></div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
      {validated && (
        <Alert variant="danger">
          Missing required fields, length requirements haven't been met, or nothing has
          been entered.
        </Alert>
      )}
      <Button variant="success m-2" type="submit">
        Submit
      </Button>
      <Button variant="warning m-2" onClick={closeModal} type="button">
        Exit
      </Button>
    </Form>
  )
}
