import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// import { ButtonGroup, Form } from 'react-bootstrap'

import AuthService from '../../services/auth.service'
import API from '../../services/details.service'
import APIMsg from '../../services/message.service'
import KICKappslogo1 from '../../imgs/poflo/logo200New.png'

import stock from '../../imgs/genericavatar.png'

import './nav.css'

export default function Navbar({
  editMode,
  currentUser
  //  originalPath
}) {
  // const [currentUser, setCurrentUser] = useState(null)
  const [userAvatar, setUserAvatar] = useState(stock)
  const [isOpenDropdown, setOpenDropdown] = useState(false)
  const [unreadMsg, setUnreadMsg] = useState(0)
  // const [edit, setEdit] = useState(false)
  // console.log(originalPath)
  // const editMode = (e) => {
  //   setEdit(!edit)
  //   console.log(edit)
  // }
  const logOut = () => {
    document.cookie = 'loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path/;'
    AuthService.logout()
  }
  useEffect(() => {
    // console.log(currentUser)
    const fetchData = async () => {
      const response = await API.get()
      const totleMsg = await APIMsg.getMsgs()
      // console.log('msg data', totleMsg.data)
      countUnreadFunc(totleMsg.data)

      if (unreadMsg > 10) {
        setUnreadMsg(`${9}+`)
      }
      if (response.data.avatarURL) {
        setUserAvatar(response.data.avatarURL)
      }
      if (response.data.sigURL) {
        setUserAvatar(response.data.sigURL)
      }
    }
    const countUnreadFunc = (totleMsgData) => {
      if (totleMsgData.length > 0) {
        totleMsgData.map((msg) => {
          if (msg.read === false) {
            setUnreadMsg(+1)
          }
        })
      }
    }
    const checkStatus = async () => {
      let user
      try {
        user = await AuthService.getCurrentUser()
      } catch (err) {
        // console.log(err)
        // currentUser.setCurrentUser(null)
        user = null
      }
      if (user) {
        // console.log(user.data)
        currentUser.setCurrentUser(user.data.loggedIn === true ? user.data : null)
        // history.push(originalPath)

        // console.log(user.data)
        fetchData()
      }
    }
    checkStatus()
  }, [unreadMsg])

  // const logOut = () => {
  //   AuthService.logout()
  // }
  return (
    <div className="allnav">
      {currentUser.currentUser && (
        <>
          <div className="col-auto">
            <div className="navbar-brand">
              <img className="navlogo" src={KICKappslogo1} alt="POflow Main Menu" />
            </div>
          </div>
          <div id="all-btns" className="lowernav pb-1">
            <div className="navbuttons">
              <div className="row mr-4">
                {currentUser.currentUser.role === 'staff' && (
                  <>
                    <Link
                      to="/messages"
                      className="col-3 mt-1"
                      name="dashbtns"
                      title="messages"
                    >
                      MESSAGES
                    </Link>

                    <Link
                      to="/messages"
                      className="col-3 mt-1"
                      name="dashbtns"
                      title="MESSAGES"
                    >
                      <div className="btn btn2 bi-envelope">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className="bi bi-envelope mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                        </svg>
                        {unreadMsg > 0 ? <div className="red-dot"></div> : null}
                      </div>
                    </Link>
                    <div className="username col-3 mt-1">
                      <div
                        className="avatar"
                        title="My Profile"
                        style={{
                          backgroundImage: `url(${userAvatar ?? stock})`
                        }}
                        onClick={() => setOpenDropdown(!isOpenDropdown)}
                      ></div>
                      {isOpenDropdown && (
                        <div className="username-dropdown">
                          <p className="user">{currentUser.currentUser.username}</p>
                          <a href="/profile">Profile</a>
                          <div className="messages-frame">
                            <a href="/messages">Messages</a>
                            {unreadMsg > 0 ? (
                              <div className="unread-notify">{unreadMsg}</div>
                            ) : null}
                          </div>
                          <a href="#1">Help</a>
                          <a href="/login" className="signout" onClick={logOut}>
                            Sign out
                          </a>
                        </div>
                      )}
                    </div>
                    {/* <Link
                  to="/admin"
                  className="col-3 mt-1"
                  name="dashbtns"
                  title="SETTINGS"
                >
                  <div className='btn btn2 shadow-sm bg-light'>
                  
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="#23639b"
                    className="bi bi-gear-wide mb-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434L8.932.727zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z" />
                  </svg>
                  </div>
                </Link> */}

                    {/* <div className="exit">
                      {currentUser.currentUser ? (
                        <a href="/login" className="right mr-2 fixed" onClick={logOut}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            className="loglink bi-shadow bi bi-x-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                          </svg>
                        </a>
                      ) : (
                        <></>
                      )}
                    </div> */}
                    {/* <div className="username">
                  <Link to={'/profile'}>
                    <div
                      className="avatar"
                      title="My Profile"
                      style={{
                        backgroundImage: `url(${userAvatar ?? stock})`
                      }}
                    >
                      <small className="card-title text-dark small fw-bold ml-4 pl-3 mt-5">
                        {currentUser.currentUser.username}
                      </small>
                    </div>
                  </Link>
                </div> */}
                  </>
                )}

                {currentUser.currentUser.role === 'director' && (
                  <>
                    <Link to="/" className="col-3 mt-1" name="dashbtns" title="DASHBOARD">
                      <div className="btn btn2">
                        {/* <b className="text-light upper fw-bold btn-text">Dashboard</b> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className="bi bi-speedometer mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z" />
                          <path
                            fillRule="evenodd"
                            d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z"
                          />
                        </svg>
                      </div>
                    </Link>
                    <Link
                      to="/admin"
                      className="col-3 mt-1"
                      name="dashbtns"
                      title="SETTINGS"
                    >
                      <div className="btn btn2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className="bi bi-gear-wide mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434L8.932.727zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z" />
                        </svg>
                      </div>
                    </Link>
                    <Link
                      to="/messages"
                      className="col-3 mt-1"
                      name="dashbtns"
                      title="MESSAGES"
                    >
                      <div className="btn btn2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          className="bi bi-envelope mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                        </svg>
                        {unreadMsg > 0 ? <div className="red-dot"></div> : null}
                      </div>
                    </Link>
                    <div className="username col-3 mt-1">
                      <div
                        className="avatar"
                        title="My Profile"
                        style={{
                          backgroundImage: `url(${userAvatar ?? stock})`
                        }}
                        onClick={() => setOpenDropdown(!isOpenDropdown)}
                      ></div>
                      {isOpenDropdown && (
                        <div className="username-dropdown">
                          <p className="user">{currentUser.currentUser.username}</p>
                          <a href="/profile">Profile</a>
                          <div className="messages-frame">
                            <a href="/messages">Messages</a>
                            {unreadMsg > 0 ? (
                              <div className="unread-notify">{unreadMsg}</div>
                            ) : null}
                          </div>
                          <a href="#1">Help</a>
                          <a href="/login" className="signout" onClick={logOut}>
                            Sign out
                          </a>
                        </div>
                      )}
                    </div>
                    {/* <div className="exit" title="EXIT">
                      {currentUser.currentUser ? (
                        <Link to="/login" className="right mr-2 fixed" onClick={logOut}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            className="loglink bi-shadow bi bi-x-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                          </svg>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div> */}
                    {/* <div className="username">
                 <Link to={'/profile'}>
                   <div
                     className="avatar"
                     title="My Profile"
                     style={{
                       backgroundImage: `url(${userAvatar ?? stock})`
                     }}
                   >
                     <small className="card-title text-dark small fw-bold ml-4 pl-3 mt-5">
                       {currentUser.currentUser.username}
                     </small>
                   </div>
                 </Link>
               </div> */}
                  </>
                )}

                {currentUser.currentUser.role === 'admin' && (
                  <>
                    <Link to="/" className="col-3 mt-1" name="dashbtns" title="DASHBOARD">
                      <div className="btn btn2">
                        {/* <b className="text-light upper fw-bold btn-text">Dashboard</b> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="white"
                          className="bi bi-speedometer mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z" />
                          <path
                            fillRule="evenodd"
                            d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z"
                          />
                        </svg>
                      </div>
                    </Link>
                    <Link
                      to="/admin"
                      className="col-3 mt-1"
                      name="dashbtns"
                      title="SETTINGS"
                    >
                      <div className="btn btn2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="white"
                          className="bi bi-gear-wide mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434L8.932.727zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z" />
                        </svg>
                      </div>
                    </Link>
                    <Link
                      to="/messages"
                      className="col-3 mt-1"
                      name="dashbtns"
                      title="MESSAGES"
                    >
                      <div className="btn btn2 messages">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="rgb(255, 255, 255)"
                          className="bi bi-envelope mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                        </svg>
                        {unreadMsg > 0 ? <div className="red-dot"></div> : null}
                      </div>
                    </Link>
                    <div className="username col-3 mt-1">
                      <div
                        className="avatar"
                        title="My Profile"
                        style={{
                          backgroundImage: `url(${userAvatar ?? stock})`
                        }}
                        onClick={() => setOpenDropdown(!isOpenDropdown)}
                      ></div>
                      {isOpenDropdown && (
                        <div className="username-dropdown">
                          <p className="user">{currentUser.currentUser.username}</p>
                          <a href="/profile">Profile</a>
                          <div className="messages-frame">
                            <a href="/messages">Messages</a>
                            {unreadMsg > 0 ? (
                              <div className="unread-notify">{unreadMsg}</div>
                            ) : null}
                          </div>
                          <a href="#1">Help</a>
                          <a href="/login" className="signout" onClick={logOut}>
                            Sign out
                          </a>
                        </div>
                      )}
                    </div>
                    {/* <div className="exit">
                      {currentUser.currentUser ? (
                        <a
                          href="/login"
                          className="right mr-2 btn fixed"
                          onClick={logOut}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="35"
                            height="35"
                            fill="rgb(149, 5, 5)"
                            className="loglink bi-shadow round1 bi bi-x-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                          </svg>
                        </a>
                      ) : (
                        <></>
                      )}
                    </div> */}
                    {/* <div className="username">
                    <Link to={'/profile'}>
                      <div
                        className="avatar"
                        title="My Profile"
                        style={{
                          backgroundImage: `url(${userAvatar ?? stock})`
                        }}
                      >
                        <small className="card-title text-dark small fw-bold ml-4 pl-3 mt-5">
                          {currentUser.currentUser.username}
                        </small>
                      </div>
                    </Link>
                  </div> */}
                  </>
                )}
              </div>

              {/* {currentUser.currentUser.role === 'admin' && (
              <div className="custom-switch1 btn-sm">
                <div>
                  EDIT
                  <Form.Switch type="switch" id="edit-page" onChange={editMode} />
                </div>
              </div>
            )} */}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
