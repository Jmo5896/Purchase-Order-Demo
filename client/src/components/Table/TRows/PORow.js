import React from 'react'
import { Tr, Td } from 'react-super-responsive-table'
import trashIcon from 'bootstrap-icons/icons/trash-fill.svg'

import ModalButton from '../../Modal'
import DeletePriorityApprovalForm from '../../Forms/Delete/priorityApproval.delete'

export default function PORow(props) {
  return (
    <Tr key={props.key}>
      {Object.values(props.data).map((x, i) => (
        <Td key={i}>{x}</Td>
      ))}
      <Td>
        <div className="post-button btn">
          <ModalButton
            icon={trashIcon}
            width={25}
            height={25}
            form={DeletePriorityApprovalForm}
            updateDeleteInfo={{
              id: props.id,
              setLoading: props.setLoading
            }}
            modalTitle="Delete Priority Approver!"
          />
        </div>
      </Td>
    </Tr>
  )
}
