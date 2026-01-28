import React, { useEffect, useState } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'

import ModalButton from '../../components/Modal'
import PurchaseRequestForm from '../../components/Forms/Create/PurchaseRequest.create'
import AddVendorForm from '../../components/Forms/Create/vendor.create'
import API from '../../services/poflow.service'
import poComponents from './poViews'

import './table.css'

export default function POflowDashboard(props) {
  const [selection, setSelection] = useState(useParams().dashboard || 'myhistory')
  const [isLoading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(false)
  const propHistory = useHistory()

  useEffect(() => {
    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    let isMounted = true

    const fetchData = async () => {
      try {
        const response = await API.getApprover()
        // console.log(response.data)

        //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
        if (isMounted) {
          setLoading(false)
          setCurrentUser(response.data)
        }
      } catch (err) {
        console.log(err)
        propHistory.push('/login')
        window.location.reload()
      }
    }
    if (isLoading) {
      fetchData()
    }

    //  TESTING IF THIS FIXES THE UNMOUNTED ERROR
    return () => {
      isMounted = false
    }
  }, [isLoading])

  const onMenuSelection = (e) => {
    e.preventDefault()
    const selector = e.target.id
    setSelection(selector)
  }

  return (
    <div className="appcontent mt-4 pt-5">
      <Container fluid>
        <div className="mt-4 pt-4 round2">
          <Row className="m-1">
            <div className="ml-4" id="newpo" title="New PO">
              <ModalButton
                classes="plusbutton"
                // title="New PO"
                // icon={plusIcon}
                alt="Make a purchase request."
                // width={80}
                // height={80}
                form={PurchaseRequestForm}
                modalTitle="Make a purchase request."
                button={true}
                // btnText={' + '}
                btnClasses="plusicon center middle btn bg-prime border1 round1 text-white"
                updateDeleteInfo={{ setLoading }}
              />
            </div>
            {currentUser.priority && currentUser.approver && currentUser.finance && (
              <div className="ml-4">
                <ModalButton
                  alt="Add a Vendor."
                  form={AddVendorForm}
                  modalTitle="Add a Vendor."
                  button={true}
                  btnText={'Add a Vendor'}
                  btnClasses="center middle btn btn-lg bg-prime border1 round1 text-white"
                  updateDeleteInfo={{ setLoading }}
                />
              </div>
            )}
            <Col sm={12}>
              <h3 className="upper center">Dashboard</h3>
            </Col>
            <Col
              lg={2}
              md={3}
              sm={12}
              className="border1 bg-white round2 center pt-3 mt-3 button-window"
            >
              <nav className="row">
                <div className="col-10 center pb-3">
                  <p className="center fw-bold mt-2">My POs</p>

                  <button
                    className={`btn menubtn col-8 nav-item shadow-sm ${
                      selection === 'mypending' ? 'bg-prime' : 'bg-dark'
                    } upper`}
                    id="mypending"
                    onClick={onMenuSelection}
                    type="button"
                  >
                    pending
                  </button>

                  <button
                    className={`btn menubtn col-8 nav-item shadow-sm ${
                      selection === 'myhistory' ? 'bg-second' : 'bg-dark'
                    } upper`}
                    id="myhistory"
                    onClick={onMenuSelection}
                    type="button"
                  >
                    history
                  </button>

                  <button
                    className={`btn menubtn col-8 nav-item shadow-sm ${
                      selection === 'myrejected' ? 'bg-warning' : 'bg-dark'
                    } upper`}
                    id="myrejected"
                    onClick={onMenuSelection}
                    type="button"
                  >
                    rejected
                  </button>
                </div>

                {currentUser && (
                  <div className="col-10 center mt-3 pb-3 mb-3">
                    <p className="center fw-bold mt-2">Approval POs</p>

                    <button
                      className={`btn menubtn col-8 nav-item shadow-sm ${
                        selection === 'approvalpending' ? 'bg-prime' : 'bg-dark'
                      } upper`}
                      id="approvalpending"
                      onClick={onMenuSelection}
                      type="button"
                    >
                      pending
                    </button>

                    <button
                      className={`btn menubtn col-8 nav-item shadow-sm ${
                        selection === 'approvalhistory' ? 'bg-second' : 'bg-dark'
                      } upper`}
                      id="approvalhistory"
                      onClick={onMenuSelection}
                      type="button"
                    >
                      history
                    </button>
                  </div>
                )}
              </nav>
            </Col>

            <Col
              lg={9}
              md={8}
              sm={12}
              className="border1 bg-white round2 center pt-3 mt-3 pb-3 active-window scrollbox"
            >
              
              {selection === 'myhistory' ? (
                <poComponents.MyHistory />
              ) : selection === 'approvalhistory' ? (
                <poComponents.ApprovalHistory />
              ) : selection === 'mypending' ? (
                <poComponents.MyPending isLoading={isLoading} />
              ) : selection === 'approvalpending' ? (
                <poComponents.ApprovalPending />
              ) : selection === 'myrejected' ? (
                <poComponents.MyRejected />
              ) : (
                'no info'
              )}
              
              <div id="powindow"></div>
              
            </Col>
            
          </Row>
        </div>
      </Container>
    </div>
  )
}
