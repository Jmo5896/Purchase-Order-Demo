import React from 'react'

import AllNav from '../Navbar'

import './header.css'

export default function Header({ currentUser }) {
  return (
    <div className="header-wrapper">
      <div className="header shadow">
        <AllNav currentUser={currentUser} />
      </div>
    </div>
  )
}
