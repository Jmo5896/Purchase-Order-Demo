import React from 'react'
import { Tr, Td } from 'react-super-responsive-table'
import trashIcon from 'bootstrap-icons/icons/trash-fill.svg'
import resendIcon from 'bootstrap-icons/icons/arrow-repeat.svg'

import ModalButton from '../../Modal'
import DeleteInviteForm from '../../Forms/Delete/Invite.delete'
import ResendInviteForm from '../../Forms/Update/Invite.resend'

export default function InviteRow(props) {
  const showBtns = (info) => {
    return (
      <>
        <Td>
          <div className="post-button btn">
            <ModalButton
              icon={resendIcon}
              width={25}
              height={25}
              form={ResendInviteForm}
              updateDeleteInfo={info}
              modalTitle="Delete Invite!"
            />
          </div>
        </Td>
        <Td>
          <div className="post-button btn">
            <ModalButton
              icon={trashIcon}
              width={25}
              height={25}
              form={DeleteInviteForm}
              updateDeleteInfo={{ id: props.id, setLoading: props.setLoading }}
              modalTitle="Delete Invite!"
            />
          </div>
        </Td>
      </>
    )
  }

  const showIcons = () => {
    return (
      <>
        <Td>
          <img
            className="disabled-icon"
            src={resendIcon}
            alt="disabled resend icon"
            width={25}
            height={25}
          />
        </Td>
        <Td>
          <img
            className="disabled-icon"
            src={trashIcon}
            alt="disabled trashcan icon"
            width={25}
            height={25}
          />
        </Td>
      </>
    )
  }

  return (
    <Tr key={props.key}>
      {Object.values(props.data).map((x, i) => (
        <Td key={i}>{typeof x !== 'boolean' ? x : x ? 'registered' : 'pending'}</Td>
      ))}
      {!props.data.status
        ? showBtns({ username: props.data.username, email: props.data.email })
        : showIcons()}
    </Tr>
  )
}
