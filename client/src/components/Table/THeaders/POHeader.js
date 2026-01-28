import React from 'react'
import { Tr, Th } from 'react-super-responsive-table'

export default function POHeader(props) {
  return (
    <Tr>
      {props.headers.map((header, i) => (
        <Th key={i} onClick={props.filterFuncs} data-value={header}>
          {header.charAt(0).toUpperCase() + header.slice(1)}
        </Th>
      ))}
      <Th>Delete Priority Approver</Th>
    </Tr>
  )
}
