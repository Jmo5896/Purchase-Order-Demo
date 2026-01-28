import React, { useState, useEffect } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import trashIcon from 'bootstrap-icons/icons/trash-fill.svg'
import editIcon from 'bootstrap-icons/icons/pencil-square.svg'

import ModalButton from '../../components/Modal'
import TrashMessage from '../../components/Forms/Update/Message.trash'
import DeleteMessages from '../../components/Forms/Delete/Msgs.delete'
import API from '../../services/message.service'
import Loading from '../../components/Loading'
import msgSubjects from './templates/msgSubjects'
import Templates from './templates'

export default function MessageBoard() {
  const [messages, setMessages] = useState([])
  const [selection, setSelection] = useState(
    useParams().selection === 'trash' ? true : false
  )
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [isCheck, setIsCheck] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await API.getMsgs()
        // console.log(response.data)

        if (isMounted) {
          setLoading(false)
          setIsCheckAll(false)
          setMessages(response.data)
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

  const readMsg = async (nanoid) => {
    const allMsgs = [...messages]
    const currentMsg = allMsgs.find((msgObj) => msgObj.nanoid === nanoid)

    if (!currentMsg.read) {
      await API.updateRead({ nanoid })
      setMessages(
        allMsgs.map((msgObj) => {
          return msgObj.nanoid === currentMsg.nanoid
            ? { ...currentMsg, read: true }
            : msgObj
        })
      )
    }
  }

  const onMenuSelection = (e) => {
    e.preventDefault()
    const selector = e.target.id === 'true' ? true : false
    setSelection(selector)

    if (isCheckAll || isCheck.length > 0) {
      setIsCheckAll(false)
      setIsCheck([])
    }
    // console.log(isCheckAll)
  }

  const handleSelectAllCheckbox = (e) => {
    setIsCheckAll(!isCheckAll)
    setIsCheck(messages.filter((msg) => msg.trash === selection).map((msg) => msg.nanoid))
    if (isCheckAll) {
      setIsCheck([])
    }
  }

  const handleCheckBoxClick = (e) => {
    const { id, checked } = e.target
    setIsCheck([...isCheck, id])
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id))
    }
  }

  return (
    <div className="msgDashboard mt-4 pt-5">
      {isLoading && <Loading />}

      <Container fluid>
        <div className="mt-4 pt-4">
          <Row className="m-1">
            <Col sm={12}>
              <h3 className="upper center">System Messages</h3>
            </Col>
            <Col
              lg={3}
              md={4}
              sm={12}
              className="border1 bg-white round2 center pt-3 mt-3 button-window"
            >
              <nav className="row">
                <div className="col-10 center pb-3">
                  <p className="center fw-bold mt-2">Message Options</p>

                  <button
                    className={`btn menubtn col-8 nav-item shadow-sm ${
                      selection === false ? 'bg-prime' : 'bg-dark'
                    } upper`}
                    id="false"
                    onClick={onMenuSelection}
                    type="button"
                  >
                    Inbox
                  </button>

                  <button
                    className={`btn menubtn col-8 nav-item shadow-sm ${
                      selection === true ? 'bg-second' : 'bg-dark'
                    } upper`}
                    id="true"
                    onClick={onMenuSelection}
                    type="button"
                  >
                    Trash Can
                  </button>
                </div>
              </nav>
            </Col>
            <Col
              lg={9}
              md={8}
              sm={12}
              className="border1 bg-white round2 center pt-3 mt-3 pb-3 active-window scrollbox"
            >
              <div className="scroll-window scrollbox border1 rounded p-1">
                {messages
                  .filter((msg) => msg.trash === selection)
                  .map((row, i) => (
                    <Row key={i}>
                      <Col sm={1}>
                        <label>
                          <input
                            className="ml-1"
                            id={row.nanoid}
                            type="checkbox"
                            onChange={handleCheckBoxClick}
                            checked={isCheck.includes(row.nanoid)}
                          />{' '}
                        </label>
                      </Col>

                      <ModalButton
                        button={true}
                        // status={row.nanoid}
                        classes="col-11"
                        btnClasses="btn-block btn shadow-no border"
                        // btnClasses="shadow-no fw-bold col-12 btn3"
                        btnText={
                          <Row
                            className={!row.read && 'font-weight-bolder'}
                            onClick={(e) => readMsg(row.nanoid)}
                          >
                            <Col sm={9} className="left">
                              {msgSubjects[row.msg_type](row.body)}
                            </Col>
                            <Col sm={3}>{row.createdAt}</Col>
                          </Row>
                        }
                        form={Templates[row.msg_type]}
                        modalTitle={msgSubjects[row.msg_type](row.body)}
                        updateDeleteInfo={{
                          ...row.body
                        }}
                      />
                    </Row>
                  ))}
              </div>
              <Row className="ml-3 mt-1">
                <Row sm={3}>
                  <small>
                    <input
                      type="checkbox"
                      onChange={handleSelectAllCheckbox}
                      checked={isCheckAll}
                    />{' '}
                    Select All
                  </small>
                </Row>
                <Row sm={1}>
                  <ModalButton
                    icon={selection ? editIcon : trashIcon}
                    width={20}
                    height={20}
                    form={TrashMessage}
                    updateDeleteInfo={{
                      trash: !selection,
                      isCheck,
                      setLoading
                    }}
                    alt={`${
                      selection ? 'Update' : 'Delete'
                    } button for selected messages.`}
                    modalTitle={`${selection ? 'Update' : 'Delete'} Your message(s).`}
                  />
                </Row>
                {selection &&
                  messages.filter((msg) => msg.trash === selection).length > 0 && (
                    <Row sm={2}>
                      <ModalButton
                        button={true}
                        btnClasses="btn btn-primary"
                        btnText="Empty Trash Can"
                        form={DeleteMessages}
                        updateDeleteInfo={{
                          trash: !selection,
                          isCheck,
                          setLoading
                        }}
                        modalTitle="Empty Trash Can"
                      />
                    </Row>
                  )}
              </Row>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}
