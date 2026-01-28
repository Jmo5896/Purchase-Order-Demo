import React from 'react'

import kickicon from '../../imgs/kickicon.png'

import './footer.css'

export default function Footer() {
  return (
    <footer className="container-fluid">
      <div className="foot-grid">
        <div className="foot1 center"></div>
        <div className="foot2 center"></div>
        <div className="foot3 center"></div>
        <div className="foot4">
          <span className="text-muted">
            <a
              className="row logo-group"
              href="https://kickapps.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              <h5 className="col-auto text-dark fcredits1">
                KICK<span className="blue">apps </span>
                <img src={kickicon} className="col-auto iconic" alt="KICKapps logo" />
                <span className="text-secondary">
                  Copyright {new Date().getFullYear()}
                </span>
              </h5>
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
