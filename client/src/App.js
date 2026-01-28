import React, { useState } from 'react'
import HttpsRedirect from 'react-https-redirect'
import CacheBuster from 'react-cache-buster'
import { LIB_VERSION } from './version'
import { BrowserRouter as Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import Loading from './components/Loading'

import './App.css'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <CacheBuster
      currentVersion={LIB_VERSION}
      isEnabled={true} //If false, the library is disabled.
      isVerboseMode={false} //If true, the library writes verbose logs to console.
      loadingComponent={<Loading />} //If not pass, nothing appears at the time of new version check.
      metaFileDirectory={'.'} //If public assets are hosted somewhere other than root on your server.
    >
      <div className="App grid-container">
        <HttpsRedirect>
          <Router basename="/">
            <div className="griditem1">
              <Header currentUser={{ currentUser, setCurrentUser }} />
            </div>
            <div className="griditem2 content">
              <Main />
            </div>
            <div className="griditem3">
              <Footer />
            </div>
          </Router>
        </HttpsRedirect>
      </div>
    </CacheBuster>
  )
}
