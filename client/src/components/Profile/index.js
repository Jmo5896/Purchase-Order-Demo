import React, { useState, useEffect } from 'react'

import API from '../../services/details.service'
import ModalButton from '../Modal'
import UpdateProfile from '../Forms/Update/UserDetails.update'
import SupportForm from '../Forms/Update/Support.send'
import ResetPasswordForm from '../Forms/Update/Password.update'

import stock from '../../imgs/genericavatar.png'
import notavailable from '../../imgs/notavailable.png'

import './profile.css'

export default function Profile(props) {
  const [isLoading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get()
        setLoading(false)
        setUserDetails(response.data)
      } catch (err) {
        props.history.push('/login')
        window.location.reload()
      }
    }
    if (isLoading) {
      window.scrollTo(0, 0)
      fetchData()
    }
  }, [isLoading, props])

  const showContent = () => {
    return (
      <div className="container">
        <div className="mb-2 row">
          <div className="col-12 center">
            <h1 className="card-title center mt-3">My Profile</h1>
          </div>
          <div className="bg-white border1 rounded col-12">
            <div className="col-8 center">
              <div
                className="bpic center row"
                alt="Your Profile Image"
                label="profile image"
                title="Your Profile Image"
                style={{
                  backgroundImage: `url(${userDetails.avatarURL || stock})`
                }}
              ></div>
              <div
                className="profile-sig border3 card-img-top mt-3 row center"
                alt="Your Signature Block"
                label="signature block"
                title="Your Signature Block"
                style={{
                  backgroundImage: `url(${userDetails.backgroundURL || notavailable})`
                }}
              ></div>
            </div>
            <div id="profile-data" className="container mt-2">
              <div className="row mb-2 pb-2 round1 ml-auto mr-auto pt-4">
                <div className="col-10 ml-auto">
                  <div className="row">
                    <div className="col-1">
                      <div className="col">
                        <strong>Name:&nbsp;</strong>
                      </div>
                      <div className="col">
                        <strong>Email:&nbsp;</strong>
                      </div>
                      <div className="col">
                        <strong>Title:&nbsp;</strong>
                      </div>
                      <div className="col">
                        <strong>Position:&nbsp;</strong>
                      </div>
                      <div className="col">
                        <strong>Phone:&nbsp;</strong>
                      </div>
                    </div>
                    <div className="col-9 offset-2 left">
                      <div className="col">
                        <b>
                          {userDetails.firstName}
                          &nbsp;
                          {userDetails.lastName}
                        </b>
                      </div>
                      <div className="col">
                        <b>{userDetails.email}</b>
                      </div>
                      <div className="col">
                        <b>{userDetails.title}</b>
                      </div>
                      <div className="col">
                        <b>{userDetails.subject_grade}</b>
                      </div>
                      <div className="col">
                        <b>
                          {userDetails.phone} ext: {userDetails.ext}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="prof-buttons" className="container pb-3 pt-5">
              <div className="row">
                <div className="row center border1 round1">
                  <ModalButton
                    form={SupportForm}
                    modalTitle="What issue are you having?"
                    button={true}
                    btnClasses="col-auto btn-left btn bg-prime text-white fw-bold"
                    btnText="App Support"
                    updateDeleteInfo={{ setLoading }}
                  />
                  <ModalButton
                    form={ResetPasswordForm}
                    modalTitle="Reset Password."
                    button={true}
                    btnClasses="col-auto btn-middle btn btn-warning fw-bold"
                    btnText="Reset Password"
                  />
                  <ModalButton
                    form={UpdateProfile}
                    modalTitle="Edit Your Profile."
                    button={true}
                    btnClasses="col-auto btn-right btn btn-light fw-bold"
                    btnText="Edit Profile"
                    updateDeleteInfo={{ ...userDetails, setLoading }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="pt-5 mt-5 bottom">{showContent()}</div>
    </div>
  )
}
