import React from 'react'
import { Link } from 'react-router-dom'
import icon from './../../../imgs/orderPending-icon.svg'
import './templates.css'

export default function PoPending(props) {
  return (
    <div
    // aria-live="assertive"
    // aria-atomic="true"
    // style="position: relative; top: 0; height: 100%; overflow: hidden"
    >
      <div
        // style="border-top: 10px solid #000000; text-align: center"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <img
          // style="width: 100; height: auto; margin-left: auto; margin-right: auto"
          alt="logo"
          style={{ width: '100px', height: '100px', margin: '10px 0' }}
          // src="https://dc-schools-s3.s3.us-east-2.amazonaws.com/dcschools/client/src/imgs/orderPending-icon.svg"
          src={icon}
        />
        <h3 style={{ margin: '10px 0', fontWeight: 'bold' }}>
          A purchase order is awaiting your approval
        </h3>

        {/* <h2
        // style="border-top: 2px solid #0e4b0e; padding: 2%"
        >
          Click <Link to="/poflow/dashboard/approvalpending">here</Link>, to view all
          pending purchase orders.
        </h2> */}
        <Link to="/poflow/dashboard/approvalpending">
          <button className="model-button">View Pending Detail</button>
        </Link>

        <p style={{ marginTop: '20px' }}>
          Copyright © {new Date().getFullYear()} KICKapps POflow
        </p>
      </div>
    </div>
  )
}
