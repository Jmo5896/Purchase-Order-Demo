import React, { useState, useEffect } from 'react'

import MyTable from '../../../components/Table'
import MyHeader from '../../../components/Table/THeaders'
import MyRow from '../../../components/Table/TRows/PODisplay.row'

export default function PendingView({ post }) {
  const [allData, setData] = useState(
    [
      ...post.data.map((obj) => {
        return {
          id: obj.id,
          quantity: obj.quantity,
          item_name: obj.item_name,
          description: obj.description,
          unit_price: obj.unit_price,
          total_price: obj.total_price
        }
      })
    ] || []
  )

  useEffect(() => {
    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    let isMounted = true

    const fetchData = () => {
      //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
      if (isMounted) {
        setData([
          ...post.data.map((obj) => {
            return {
              id: obj.id,
              quantity: obj.quantity,
              item_name: obj.item_name,
              description: obj.description,
              unit_price: obj.unit_price,
              total_price: obj.total_price
            }
          })
        ])
      }
    }
    if (post) {
      fetchData()
    }
    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    return () => {
      isMounted = false
    }
  }, [post])
  return (
    <MyTable tData={allData} sample={{ ...allData[0] }} header={MyHeader} row={MyRow} />
  )
}
