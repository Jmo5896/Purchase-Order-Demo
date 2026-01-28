import React from 'react'
import { Tr, Th } from 'react-super-responsive-table'

export default function Header(props) {
  const isVendorId = (header, i) => {
    if (header !== 'vendorId') {
      return <Th key={i}>{header.charAt(0).toUpperCase() + header.slice(1)}</Th>
    }
  }

  return <Tr>{props.headers.map(isVendorId)}</Tr>
}
