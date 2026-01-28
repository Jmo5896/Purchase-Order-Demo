import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import './templates.css'
import MyTable from '../../../components/Table'
import MyHeader from '../../../components/Table/THeaders'
import MyRow from '../../../components/Table/TRows/PODisplay.row'

export default function PoRequisition({ post, onHide }) {
  const [body, setBody] = useState(post)

  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      // console.log('trigger useEffect')
      console.log(post)
      setBody(post)
    }

    return () => {
      isMounted = false
    }
  }, [post])

  const closeModal = () => {
    onHide()
  }

  const calculateTotal = (arr) => {
    const reducer = (previousValue, currentValue) => previousValue + currentValue
    const amounts = arr.map((obj) => obj.total_price)
    return amounts.reduce(reducer)
  }
  return (
    <div
    // aria-live="assertive"
    // aria-atomic="true"
    // style="position: relative; top: 0; height: 100%; overflow: hidden"
    >
      <Button variant="warning m-2" onClick={closeModal} type="button">
        Exit
      </Button>
      <div
      // style="z-index: 1;position: sticky;margin:auto;padding-left:50px;text-align:center;"
      >
        {/* <img
          // style="width: 100; height: auto; margin-left: auto; margin-right: auto"
          src="https://dc-schools-s3.s3.us-east-2.amazonaws.com/dcschools/client/src/imgs/logo192.png"
        /> */}
        <h1>Account Code: (This may be notes from finance)</h1>
        <br />
        <h2>name: {body.accountCode.name}</h2>
        <h2>code: {body.accountCode.code}</h2>
        <br />
        <h3>Staffer: {body.name},</h3>
        <h3>Email: {body.email}</h3>
        <br />
        <MyTable
          tData={body.items}
          sample={{ ...body.items[0] }}
          header={MyHeader}
          row={MyRow}
        />
        <br />
        <br />
        <div
        // style="display: flex;flex-wrap: wrap;margin-right: -15px;margin-left: -15px;padding-top: 10px"
        >
          <div
          // style="flex-basis: 0;flex-grow: 1;max-width: 100%;padding-left: 20px; text-align:left"
          >
            Shipping and Handling: ${body.shippingHandling.toFixed(2)}
          </div>
          <h5>
            Grand total: $
            {body.items.length > 0 &&
              (calculateTotal(body.items) + body.shippingHandling).toFixed(2)}
          </h5>
        </div>
        <br />
        <br />
        <div
        // style="display: flex;flex-wrap: wrap;margin-right: -15px;margin-left: -15px;padding-top: 10px"
        >
          <div
          // style="flex-basis: 0;flex-grow: 1;max-width: 100%;"
          >
            <span
            // style="padding-left: 20px; text-align:left"
            >
              {/* Grand Total: ${grandTotal} */}
            </span>
          </div>
        </div>
        <br />
        <br />
        <div
        // style="display: flex;flex-wrap: wrap;margin-right: -15px;margin-left: -15px;padding-top: 10px"
        >
          <div
          // style="flex-basis: 0;flex-grow: 1;max-width: 100%;"
          >
            <span
            // style="padding-left: 20px; text-align:left"
            >
              Vendor Name: {body.vendor} ({body.vendorId})
            </span>
          </div>
          <div
          // style="flex-basis: 0;flex-grow: 1;max-width: 100%;"
          >
            <span
            //  style="padding-left: 20px; text-align:left"
            >
              Notes: {body.notes || 'No notes on purchase order'}
            </span>
          </div>
          {body.quote ? (
            <div>
              {' '}
              To view quote, click{' '}
              <a href={body.quote} target="_blank" rel="noreferrer">
                HERE
              </a>
            </div>
          ) : (
            ''
          )}
        </div>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Exit
        </Button>
        <br />
        <br />

        <p>Copyright © {new Date().getFullYear()} Doddridge County Schools</p>
      </div>
    </div>
  )
}
