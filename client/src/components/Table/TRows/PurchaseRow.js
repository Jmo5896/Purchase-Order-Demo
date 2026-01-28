import React from 'react'
import { Tr, Td } from 'react-super-responsive-table'
import { Form } from 'react-bootstrap'
import trashIcon from 'bootstrap-icons/icons/trash-fill.svg'

export default function UserRow(props) {
  return (
    <Tr key={props.key}>
      {Object.entries(props.data).map(
        ([k, v], i) =>
          k !== 'vendorId' && (
            <Td key={i}>
              {k === 'total_price' ? (
                v
              ) : k === 'vendor' ? (
                <Form.Group>
                  <Form.Control
                    required
                    name={k}
                    as={() =>
                      props.purchaseFuncs.Select(
                        (e) => props.purchaseFuncs.updateFields(props.key, k, e),
                        v
                      )
                    }
                  />
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Control
                    required
                    onChange={
                      k === 'unit_price' || k === 'quantity'
                        ? (e) =>
                            props.purchaseFuncs.updateTotal(props.key, k, e.target.value)
                        : (e) =>
                            props.purchaseFuncs.updateFields(props.key, k, e.target.value)
                    }
                    name={k}
                    as="input"
                    type={k === 'unit_price' || k === 'quantity' ? 'number' : 'text'}
                    defaultValue={v}
                    maxLength={100}
                  />
                </Form.Group>
              )}
            </Td>
          )
      )}
      <Td>
        <div
          onClick={(e) => props.purchaseFuncs.deleteRow(props.key)}
          className="icon svg btn-click"
          alt={`Delete row number ${props.key}`}
          style={{
            backgroundImage: `url(${trashIcon})`,
            width: 25,
            height: 25
          }}
        ></div>
      </Td>
    </Tr>
  )
}
