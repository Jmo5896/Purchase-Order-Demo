import React, { useEffect, useState } from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import API from '../../../services/poflow.service'

export default function UpdataPriorityApprovalOrderForm(props) {
  const [content, setContent] = useState()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false)
      setContent(props.post.data)
    }
    if (isLoading) {
      window.scrollTo(0, 0)
      fetchData()
    }
  }, [isLoading, props])

  const onDragEnd = (results) => {
    const { destination, source } = results
    if (!destination) {
      return false
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return false
    }
    let newColumnOrder = [...content]
    const movingItem = newColumnOrder.splice(source.index, 1)[0]
    newColumnOrder.splice(destination.index, 0, movingItem)
    newColumnOrder = newColumnOrder.map((obj, i) => {
      obj.order = i + 1
      return obj
    })
    setContent(newColumnOrder)
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()

    const sendData = async (data) => {
      props.onHide()
      await API.updatePriorityOrder(data)
      props.post.setLoading(true)
    }
    sendData(content)
  }

  const closeModal = () => {
    props.onHide()
    setContent(props.post.data)
  }

  function buildContent(apiRes) {
    return (
      <>
        <Row className="justify-content-md-center">
          <Col>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="main">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="draggable"
                  >
                    <p className="center grey">Drag to Rearrange</p>
                    {apiRes &&
                      apiRes.map((temp, i) => (
                        <Draggable
                          key={temp.id}
                          index={i}
                          draggableId={`order_index-${temp.order}`}
                        >
                          {(provided) => (
                            <div
                              className="clear-card-side border5 mb-2 round2 col-6 center p-2"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              {temp.email}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Col>
        </Row>
        <Button variant="success m-2" type="submit" onClick={onFormSubmit}>
          Submit
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Exit
        </Button>
      </>
    )
  }

  return <>{buildContent(content)}</>
}
