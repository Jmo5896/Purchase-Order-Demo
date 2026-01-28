import React from 'react'
import { Tr, Td } from 'react-super-responsive-table'
import trashIcon from 'bootstrap-icons/icons/trash-fill.svg'
import permissionIcon from 'bootstrap-icons/icons/person-plus.svg'

import ModalButton from '../../Modal'
import DeleteUserForm from '../../Forms/Delete/User.delete'
import AddUserPermissionsForm from '../../Forms/Update/AddPermissions.update'

export default function UserRow(props) {
  return (
    <Tr key={props.key}>
      {Object.values(props.data).map((x, i) => (
        <Td key={i}>{typeof x !== 'boolean' ? x : x ? 'registered' : 'pending'}</Td>
      ))}
      <Td>
        {props.data.role !== 'admin' ? (
          <ModalButton
            icon={permissionIcon}
            imgClasses="icon"
            width={25}
            height={25}
            form={AddUserPermissionsForm}
            updateDeleteInfo={{ id: props.id, setLoading: props.setLoading }}
            modalTitle="Give user edit permissions!"
          />
        ) : (
          <img
            className="disabled-icon"
            src={permissionIcon}
            alt="disabled add permissions icon"
            width={25}
            height={25}
          />
        )}
      </Td>
      <Td>
        <ModalButton
          icon={trashIcon}
          width={25}
          height={25}
          form={DeleteUserForm}
          updateDeleteInfo={{ id: props.id, setLoading: props.setLoading }}
          modalTitle="Delete User!"
        />
      </Td>
    </Tr>
  )
}
