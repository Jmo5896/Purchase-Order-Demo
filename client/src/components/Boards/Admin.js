import React, { useState, useEffect } from 'react'
import InviteIcon from 'bootstrap-icons/icons/envelope.svg'
import plusIcon from 'bootstrap-icons/icons/plus-square.svg'
import sortIcon from 'bootstrap-icons/icons/filter-square.svg'

import UserService from '../../services/user.service'

import ModalButton from '../Modal'
import InviteForm from '../Forms/Create/Invite.create'
import PriorityApprovalForm from '../Forms/Create/priorityApproval.create'
import UpdataPriorityApprovalOrderForm from '../Forms/Update/PriorityApprovalOrder.update'
import CreateFlowForm from '../Forms/Create/Flow.create'
import UpdateFlowForm from '../Forms/Update/PO.update'
import Loading from '../Loading'
import MyTable from '../Table'
import InviteHeader from '../Table/THeaders/InviteHeader'
import InviteRow from '../Table/TRows/InviteRow'
import UserHeader from '../Table/THeaders/UserHeader'
import UserRow from '../Table/TRows/UserRow'
import POHeader from '../Table/THeaders/POHeader'
import PORow from '../Table/TRows/PORow'

import './dashboard.css'

export default function Admin(props) {
  const [allData, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [isSelected, setSelected] = useState('poFlow')
  const [colOrder, setOrder] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await UserService.getAdminBoard()
        // const bannerRes = await API.getBanner()
        // console.log(response.data)
        if (isMounted) {
          setLoading(false)
          setData(response.data)
        }
        // if (bannerRes.data) {
        //   setBanner(bannerRes.data)
        // }
      } catch (err) {
        console.log(err)
        // props.history.push('/login')
        // window.location.reload()
      }
    }
    if (isLoading) {
      window.scrollTo(0, 0)
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [isLoading, allData, props])

  const tableSelect = (e) => {
    // console.log(allData)
    setSelected(e.target.value)
  }

  const showContent = (selected) => {
    if (selected === 'poFlow') {
      return (
        <div className="container">
          <div className="m-2">
            {/* <h2 className="center pb-3">POflow</h2> */}

            {/* <Link to="/poflow/dashboard">
              <img className="logo border5 shadow btn" src={POflow} alt="POflow"></img>
            </Link> */}
          </div>
          <div className="row">
            <div className="center col-lg-7 col-md-10 col-sm-12 order-1 mb-5">
              <div className="border5">
                <div className="col pending-header mt-3">
                  <h4>Priority Approvers</h4>
                </div>
                <div className="row pb-3 borderbtm col-11 center">
                  <div className="col-5 center">
                    <span>
                      <ModalButton
                        classes="btn p-2"
                        icon={plusIcon}
                        width={40}
                        height={40}
                        form={PriorityApprovalForm}
                        modalTitle="Create a Priority Approver."
                        updateDeleteInfo={{
                          setLoading,
                          order:
                            allData.priorityApprovals.length > 0
                              ? allData.priorityApprovals.length + 1
                              : 1
                        }}
                      />
                      <br />
                      Add
                    </span>
                  </div>
                  <div className="col-5 center">
                    <span>
                      <ModalButton
                        classes="btn p-2"
                        icon={sortIcon}
                        width={40}
                        height={40}
                        form={UpdataPriorityApprovalOrderForm}
                        modalTitle="Update Order of Priority Approvers."
                        updateDeleteInfo={{
                          setLoading,
                          data: allData.priorityApprovals
                        }}
                      />
                      <br />
                      Arrange
                    </span>
                  </div>
                </div>
                <div className="scrollbox col-auto">
                  <MyTable
                    tData={allData.priorityApprovals}
                    sample={{ ...allData.priorityApprovals[0] }}
                    header={POHeader}
                    filterFuncs={colSort}
                    row={PORow}
                    setLoading={setLoading}
                    // edit={allData.priorityApprovals}
                  />
                </div>
              </div>
            </div>

            <div className="center col-lg-5 col-md-10 col-sm-12 mb-5">
              <div className="border5">
                <div className="col history-header mt-2">
                  <h4>PO Flows</h4>
                </div>
                <div className="pb-3 borderbtm col-11 center">
                  <span>
                    <ModalButton
                      classes="btn"
                      icon={plusIcon}
                      width={40}
                      height={40}
                      form={CreateFlowForm}
                      modalTitle="Create a new Form flow."
                      updateDeleteInfo={{
                        setLoading,
                        reqIds: allData.poFlow.map((obj) => obj.requisitionId)
                      }}
                    />
                    <br />
                    Add
                  </span>
                </div>
                <div className="scrollbox">
                  <ul style={{ listStyleType: 'none', marginLeft: '-40px' }}>
                    {allData[selected].map((obj, i) => (
                      <li key={i}>
                        <ModalButton
                          // classes="btn p-2"
                          btnClasses="btn btn-secondary btn-block"
                          btnText={obj.requisitionId}
                          button={true}
                          status={obj.id}
                          form={UpdateFlowForm}
                          modalTitle="Update Flow."
                          updateDeleteInfo={{
                            setLoading,
                            ...obj,
                            reqIds: allData.poFlow.map((obj) => obj.requisitionId)
                          }}
                        />
                        <hr />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        // <MyTable
        //   tData={allData[selected]}
        //   sample={{ ...allData[selected][0] }}
        //   header={POHeader}
        //   // filterFuncs={colSort}
        //   row={PORow}
        //   setLoading={setLoading}
        // />
      )
    } else if (selected === 'users') {
      return (
        <MyTable
          tData={allData[selected]}
          sample={{ ...allData[selected][0] }}
          header={UserHeader}
          filterFuncs={colSort}
          row={UserRow}
          setLoading={setLoading}
        />
      )
    }
    return (
      <>
        <div className="row">
          <div className="col center m-2">
            <ModalButton
              classes="btn p-2 invitebutton"
              icon={InviteIcon}
              label="Invite"
              width={40}
              height={40}
              form={InviteForm}
              modalTitle="Create an Invite."
              updateDeleteInfo={{ setLoading }}
            />
          </div>
        </div>
        <MyTable
          tData={allData[selected]}
          sample={{ ...allData[selected][0] }}
          header={InviteHeader}
          filterFuncs={colSort}
          row={InviteRow}
          setLoading={setLoading}
        />
      </>
    )
  }

  const colSort = (e) => {
    const currentData = { ...allData }
    const col = e.target.dataset.value

    let sortFunc
    if (col === 'status') {
      // console.log(colOrder)
      if (colOrder) {
        sortFunc = (a, b) => b[col] - a[col] || a.username.localeCompare(b.username)
      } else {
        sortFunc = (a, b) => a[col] - b[col] || a.username.localeCompare(b.username)
      }
    } else {
      if (colOrder) {
        sortFunc = (a, b) => {
          var nameA = a[col].toUpperCase()
          var nameB = b[col].toUpperCase()
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }

          // names must be equal
          return 0
        }
      } else {
        sortFunc = (a, b) => {
          var nameA = a[col].toUpperCase()
          var nameB = b[col].toUpperCase()
          if (nameA < nameB) {
            return 1
          }
          if (nameA > nameB) {
            return -1
          }

          // names must be equal
          return 0
        }
      }
    }
    setOrder(!colOrder)

    currentData[isSelected] = currentData[isSelected].sort(sortFunc)
    setData(currentData)

    // console.log(col)
    // setData(currentData.colSort())
  }

  return (
    <div className="appinvites container-100 pt-5 mt-5 bottom">
      <div className="invites row mt-4 pt-4">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 center">
          <div className="admin-card card-clear mb-2 round2 center shadow col-xs-12 col-lg-10 col-md-12 col-sm-12">
            <div className="tabbed-area">
              <div className="tabs-group row ml-3 ">
                <input
                  value="users"
                  type="radio"
                  name="tabs"
                  id="tab1"
                  checked={isSelected === 'users'}
                  onChange={tableSelect}
                />
                <label htmlFor="tab1" className="tabs col-2 border1 btn-light roundtop">
                  Users
                </label>

                <input
                  value="invitees"
                  type="radio"
                  name="tabs"
                  id="tab2"
                  checked={isSelected === 'invitees'}
                  onChange={tableSelect}
                />
                <label htmlFor="tab2" className="tabs col-1 border1 btn-light roundtop">
                  Invites
                </label>

                <input
                  value="poFlow"
                  type="radio"
                  name="tabs"
                  id="tab3"
                  checked={isSelected === 'poFlow'}
                  onChange={tableSelect}
                />
                <label htmlFor="tab3" className="tabs border1 btn-light roundtop">
                  Flows
                </label>
              </div>

              <div className="box-wrap">
                {isLoading && <Loading />}
                <div>
                  {allData && (
                    <div className="admin-options col-12 fw-bold">
                      {showContent(isSelected)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
