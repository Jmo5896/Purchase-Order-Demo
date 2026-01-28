import React from 'react'
import { Link } from 'react-router-dom'
import icon from './../../../imgs/postApproved-icon.svg'
import './templates.css'

export default function PostApproved({ post }) {
  // console.log(props)
  const bodyStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
  return (
    <div
    // aria-live="assertive"
    // aria-atomic="true"
    // style="position: relative; top: 0; height: 100%; overflow: hidden"
    >
      <div
        // style="border-top: 10px solid #000000; text-align: center"
        style={bodyStyle}
      >
        <img
          // style="width: 100; height: auto; margin-left: auto; margin-right: auto"
          alt="logo"
          style={{ width: '100px', height: '100px', margin: '10px 0' }}
          // src="https://dc-schools-s3.s3.us-east-2.amazonaws.com/dcschools/client/src/imgs/logo192.png"
          src={icon}
        />
        <h3 style={{ margin: '10px 0', fontWeight: 'bold' }}>Thank you for the post!</h3>
        <p
        // style="border-top: 2px solid #0e4b0e; padding-top: 2%"
        >
          Your post has been sent to the following pages:
          <ul style={{ margin: '0' }}>
            {post.fbPages.map((obj, i) => (
              <li key={i}>
                <a href={obj.url} target="_blank" rel="noreferrer">
                  {obj.page} facebook page
                </a>
              </li>
            ))}
          </ul>
        </p>
        <p
        // style="border-top: 2px solid #0e4b0e; padding-top: 2%"
        >
          ({post.message})
        </p>
        {/* <h2
        // style="border-top: 2px solid #0e4b0e; padding: 2%"
        >
          Click <Link to="/dashboard">here</Link>, to manage posts.
        </h2> */}
        <Link to="/poflow/dashboard">
          <button className="model-button">View Post Detail</button>
        </Link>

        <p style={{ marginTop: '20px' }}>
          Copyright © {new Date().getFullYear()} KICKapps POflow
        </p>
      </div>
    </div>
  )
}
