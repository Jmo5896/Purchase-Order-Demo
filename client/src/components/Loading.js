import React from 'react'

import loader from '../imgs/loading.gif'

import '../App.css'

export default function Loading() {
  return (
    <div className="loading">
      <img alt="loading icon" className="dawgif" src={loader} />
    </div>
  )
}
