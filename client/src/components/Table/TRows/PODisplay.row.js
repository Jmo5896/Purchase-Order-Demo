import React from 'react'
import { Tr, Td } from 'react-super-responsive-table'

export default function MyRow(props) {
  return (
    <Tr key={props.key}>
      {Object.values(props.data).map((x, i) => (
        <Td key={i}>{x}</Td>
      ))}
    </Tr>
  )
}
