import React, { useState } from 'react'
import { Button, Form, Alert, Row, Col } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import trashIcon from 'bootstrap-icons/icons/trash-fill.svg'

import API from '../../../services/poflow.service'

export default function CreateFlowForm(props) {
  const [address, setAddress] = useState(
    props.post.address ? props.post.address.split('|') : []
  )
  const [validated, setValidated] = useState(false)
  const [content, setContent] = useState({
    switchNull:
      props.post.Approvals.length > 0
        ? props.post.Approvals.filter((obj) => obj.switch === null)
        : [],
    switchTrue:
      props.post.Approvals.length > 0
        ? props.post.Approvals.filter((obj) => obj.switch === true)
        : [],
    switchFalse:
      props.post.Approvals.length > 0
        ? props.post.Approvals.filter((obj) => obj.switch === false)
        : []
  })
  const [emails, setEmails] = useState(
    props.post.Approvals.length > 0 ? props.post.Approvals.map((obj) => obj.email) : []
  )
  const [approver, setApprover] = useState('')
  const [newSwitch, setSwitch] = useState(
    props.post.Approvals.find((obj) => obj.switch === true) ? true : false
  )

  const stateReset = () => {
    setAddress(props.post.address ? props.post.address.split('|') : [])
    setValidated(false)
    setContent({
      switchNull:
        props.post.Approvals.length > 0
          ? props.post.Approvals.filter((obj) => obj.switch === null)
          : [],
      switchTrue:
        props.post.Approvals.length > 0
          ? props.post.Approvals.filter((obj) => obj.switch === true)
          : [],
      switchFalse:
        props.post.Approvals.length > 0
          ? props.post.Approvals.filter((obj) => obj.switch === false)
          : []
    })
    setApprover('')
    setSwitch(props.post.Approvals.find((obj) => obj.switch === true) ? true : false)
    setEmails(
      props.post.Approvals.length > 0 ? props.post.Approvals.map((obj) => obj.email) : []
    )
  }

  const onInitialEmailChange = (e) => {
    const c = { ...content }
    const es = [...emails]
    const userInput = e.target.value
    if (!userInput) {
      setEmails(es.filter((e) => e !== c.switchNull[0].email))
      c.switchNull = []
      setContent(c)
    }
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
    // obj with 3 keys, switchTrue, switchFalse, switchNull
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
      } else if (source.droppableId === 'switchtrue') {
        newContent.switchTrue = currentItems
      } else {
        newContent.switchNull = currentItems
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
      setContent({
        ...newContent,
        ...endResult
      })
    }
  }

  const addApprover = (e) => {
    const es = [...emails]
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(approver)) {
      const c = { ...content }
      es.push(approver)
      if (!newSwitch) {
        if (c.switchNull.length > 0) {
          c.switchNull.push({
            email: approver,
            order: c.switchNull.length + 1,
            id: c.id
          })
        } else {
          c.switchNull.push({
            email: approver,
            order: 1,
            id: c.id
          })
        }
      } else {
        if (c.switchTrue.length > 0) {
          c.switchTrue.push({
            email: approver,
            order: c.switchTrue.length + 1,
            id: c.id
          })
        } else {
          c.switchTrue.push({
            email: approver,
            order: 1,
            id: c.id
          })
        }
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
    const currentEmail = e.target.value
    setApprover(currentEmail)
  }

  const removeDragItem = (event) => {
    const [col, tempEmail] = event.target.id.split('|')
    const c = { ...content }
    const es = [...emails]

    const e = c[col].find((obj) => obj.email === tempEmail)
    console.log(c[col][0].email, tempEmail)
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
          email: formDataObj.initialApprover.trim(),
          order: 1,
          switch: null
        }
      ]

      for (const key in content) {
        if (key === 'switchTrue') {
          content[key].forEach((obj, i) => {
            tempArray.push({
              email: obj.email.trim(),
              order: i + 2,
              switch: true
            })
          })
        } else if (key === 'switchFalse') {
          content[key].forEach((obj, i) => {
            tempArray.push({
              email: obj.email.trim(),
              order: i + 2,
              switch: false
            })
          })
        }
      }
    } else {
      tempArray = [...content.switchNull]
    }
    const propsApprovals = props.post.Approvals.map((obj) => {
      const newObj = { ...obj }
      delete newObj.id
      return newObj
    })

    const data = {
      id: props.status,
      requisitionId: formDataObj.requisitionId.trim().toUpperCase(),
      locationCode: formDataObj.locationCode || '',
      switch: formDataObj.switch || null,
      address: `${formDataObj.buildingName}|${formDataObj.buildingAddress}|${formDataObj.cityStateZip}`,
      approvers:
        JSON.stringify(tempArray) === JSON.stringify(propsApprovals) ? null : tempArray
    }

    const sendData = async (data) => {
      props.onHide()
      await API.update(data)
      props.post.setLoading(true)
    }
    const form = e.currentTarget
    const switchYes = newSwitch
    const newReqIds = props.post.reqIds.filter((x) => x !== props.post.requisitionId)
    if (
      form.checkValidity() === false ||
      (!switchYes && content.switchNull.length <= 0) ||
      newReqIds.includes(data.requisitionId.toUpperCase()) ||
      (switchYes && (content.switchFalse.length <= 0 || content.switchTrue.length <= 0))
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
          maxLength={35}
          defaultValue={props.post.requisitionId.toLowerCase() || ''}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>
          <h6>Location Code</h6> (if blank all account codes will be available for
          purchase order):
        </Form.Label>
        <Form.Control
          type="text"
          name="locationCode"
          defaultValue={props.post.locationCode.replace('dc', '') || ''}
        />
      </Form.Group>

      <div className="row">
        <Form.Group className="col-12">
          <Form.Label>
            <h6>
              Building Name: <span style={{ color: 'red' }}>*</span>
            </h6>
          </Form.Label>
          <Form.Control required name="buildingName" defaultValue={address[0] || ''} />
        </Form.Group>
        <Form.Group className="col-6">
          <Form.Label>
            <h6>
              Building Address: <span style={{ color: 'red' }}>*</span>
            </h6>
          </Form.Label>
          <Form.Control required name="buildingAddress" defaultValue={address[1] || ''} />
        </Form.Group>
        <Form.Group className="col-6">
          <Form.Label>
            <h6>
              Building city, state, and zip: <span style={{ color: 'red' }}>*</span>
            </h6>
          </Form.Label>
          <Form.Control required name="cityStateZip" defaultValue={address[2] || ''} />
        </Form.Group>
      </div>

      {newSwitch ? (
        <>
          <Form.Group>
            <Form.Label>
              Name your flow switch:<span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              maxLength={50}
              required
              name="switch"
              defaultValue={props.post.switch || ''}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>
              Who will be your initial approver (They will pick the direction of the
              flow):
              <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              onChange={onInitialEmailChange}
              required
              name="initialApprover"
              defaultValue={
                props.post.Approvals.find((obj) => obj.switch === null).email || ''
              }
            />
          </Form.Group>

          <h5> Add approvers to each switch: </h5>
          <input name="other" type="text" onChange={captureVal} value={approver} />
          <button type="button" onClick={addApprover} className="btn btn-success m-2">
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
                                  className="icon trashcan"
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
          <input name="other" type="text" onChange={captureVal} value={approver} />
          <button type="button" onClick={addApprover} className="btn-md btn-success m-2">
            add
          </button>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="switchNull">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {content.switchNull &&
                    content.switchNull.map((temp, i) => (
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
                              id={`switchNull|${temp.email}`}
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
