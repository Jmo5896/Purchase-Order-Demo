import React from 'react'
import { Tr, Th } from 'react-super-responsive-table'

export default function Header(props) {
  return (
    <Tr>
      {props.headers.map((header, i) => (
        <Th key={i}>{header.charAt(0).toUpperCase() + header.slice(1)}</Th>
      ))}
    </Tr>
  )
}
