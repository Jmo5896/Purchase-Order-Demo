import React from 'react'
import { Table, Thead, Tbody } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

// sample, tData, header, filterFuncs, row, active, facilities, edit, setLoading, purchaseFuncs
export default function MyTable(props) {
  const sample = props.sample || {}
  delete sample.id
  delete sample.active

  const prepData = (row) => {
    const data = {}
    Object.keys(sample).forEach((key) => {
      if (key !== 'active') data[key] = row[key]
    })
    return data
  }
  return (
    <div className="table-responsive-md">
      <Table
        key={props.tData.length}
        className={`table table-striped table-sm table-hover table-zoom ${
          props.classes || ''
        }`}
      >
        <Thead>
          {props.header({
            headers: Object.keys(sample),
            filterFuncs: props.filterFuncs || null
          })}
        </Thead>
        <Tbody>
          {props.tData.map((row, i) =>
            props.row({
              key: i,
              active: props.active,
              facilities: props.facilities || false,
              edit: props.edit,
              data: prepData(row.tdata || row),
              profile: row.profile || null,
              id: row.id || i,
              setLoading: props.setLoading || false,
              purchaseFuncs: props.purchaseFuncs || false
            })
          )}
        </Tbody>
      </Table>
    </div>
  )
}
