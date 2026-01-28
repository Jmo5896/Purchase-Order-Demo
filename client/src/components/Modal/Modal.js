import React from 'react'
import { Modal, Row, Col } from 'react-bootstrap'
import closeIcon from 'bootstrap-icons/icons/x-circle-fill.svg'

export default function MyModal(props) {
  return (
    <Row onClick={(e) => e.stopPropagation()}>
      <Col lg={6} md={7} sm={8} xs={12}>
        <Modal
          show={props.show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          classes={props.classes}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>{props.title}</Modal.Title>
            {/* EXIT ICON FOR ALL MODAL POPUPS */}
            <div className="light" onClick={props.onHide}>
              <img src={closeIcon} alt="icon" width={25} height={25} />
            </div>
          </Modal.Header>

          <Modal.Body>{props.children}</Modal.Body>
        </Modal>
      </Col>
    </Row>
  )
}
