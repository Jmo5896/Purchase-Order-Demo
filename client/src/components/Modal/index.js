import React, { useState } from 'react'

import MyModal from './Modal'

export default function ModalButton(props) {
  const [modalShow, setModalShow] = useState(false)
  const toggleModal = () => {
    setModalShow(!modalShow)
  }

  const buttonOrIcon = () => {
    if (props.button) {
      return (
        <button
          onClick={toggleModal}
          value={props.status}
          className={`${props.btnClasses}`}
        >
          {props.btnText}
        </button>
      )
    }
    return (
      <div
        className={
          props.imgClasses ? props.imgClasses + ' btn-click' : 'icon svg mt-3 mb-3'
        }
        alt={props.alt || 'NO-ALT'}
        style={{
          backgroundImage: `url(${props.icon})`,
          width: props.width,
          height: props.height
        }}
      ></div>
    )
  }
  return (
    <div className={`${props.classes || ''}`} onClick={toggleModal}>
      {buttonOrIcon()}
      <MyModal show={modalShow} onHide={toggleModal} title={props.modalTitle}>
        {props.form({
          onHide: toggleModal,
          post: props.updateDeleteInfo || false,
          reason: props.reason,
          formLoad: modalShow,
          status: props.status
        })}
      </MyModal>
    </div>
  )
}
