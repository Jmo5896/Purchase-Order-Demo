import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import { Row, Col, Container } from 'react-bootstrap'

import clientlogo from '../../imgs/clientlogo1.png'
import poflow1 from '../../imgs/poflo/logo100New.png'
import print from '../../imgs/printicon50w.png'
import supersign from '../../imgs/poflo/adminsig.png'
import othersign from '../../imgs/poflo/directorsig.png'

import './style.css'

class ComponentToPrint extends React.Component {
  parseDate = (date) => {
    const newDate = new Date(date)
    return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`
  }

  totalTotal = (arr, shipping) => {
    let total = shipping
    for (let i = 0; i < arr.length; i++) {
      total += arr[i].total_price
    }
    return total
  }
  render() {
    return (
      <div className="mt-5 pb-5">
        <Container className="fluid bg-white pdftall">
          <Row className="center col-12 center">
            <Col>
              <img src={clientlogo} alt="client logo" />
            </Col>
          </Row>
          <Row className="pt-3">
            <Col>
              <p className="left pl-4">Vendor: {this.props.vendorId}</p>
            </Col>
            <Col>
              <h2 className="center"> PURCHASE ORDER </h2>
            </Col>
            <Col>
              <p className="right pr-4">PO #: {this.props.poNumber}</p>
            </Col>
          </Row>

          <Row className="pt-3">
            <Col className="left pl-4 center">
              <p className="bg-dark text-white fw-bold center">
                MAIL INVOICES IN DUPLICATE TO:
                <p className="fw-bold center bg-white text-black">
                  TAX NUMBER 55-6000313
                </p>
              </p>
            </Col>
            <Col>
              <div className="row">
                <Row className="center fw-bold upper">
                  {' '}
                  Doddridge County School System{' '}
                </Row>
                <Row className="justify center">
                  {' '}
                  268 Bulldog Drive West Union, WV 26456{' '}
                </Row>
                <Row className="justify center">
                  {' '}
                  <small className="center fw-bold">PHONE: (304) 873-2300&nbsp;</small>
                  <small className="center fw-bold">&nbsp;FAX: (304) 873-2210</small>
                </Row>
              </div>
            </Col>
            <Col>
              <div className="bg-dark row m-1">
                <small className="text-white fw-bold center mt-1">
                  &nbsp;NOTICE TO VENDOR&nbsp;
                  <br />
                  <small className="center vendor-notice">
                    THE PURCHASE ORDER NUMBER MUST APPEAR ON ALL INVOICES, PACKAGES AND
                    CORRESPONDENCE. PREPAY ALL TRANSPORTATION CHARGES
                  </small>
                </small>
              </div>
            </Col>
          </Row>

          <Row className="pt-3">
            <Col className="left pl-4">
              <h5 className="pr-5 mr-5 fw-bold">
                &nbsp;TO:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </h5>
              <div>
                {this.props.addressInfo.vendorName}
                <br />
                {this.props.addressInfo.secondName && (
                  <>
                    {this.props.addressInfo.secondName}
                    <br />
                  </>
                )}
                {this.props.addressInfo.address}
                <br />
                {this.props.addressInfo.cityStateZip}
                <br />
              </div>
            </Col>
            <Col className="right pr-4 center">
              <h5 className="pr-5 mr-5 fw-bold">&nbsp;DELIVER TO:&nbsp;</h5>
              <p className="col-7 offset-4 left">
                {this.props.toAddress[0]}
                <br />
                {this.props.toAddress[1]}
                <br />
                {this.props.toAddress[2]}
                <br />
                (304) 873-2300
              </p>
            </Col>
          </Row>

          <Row className="col-auto pt-3 center">
            <Col>
              <p className="pl-4 fw-bold">
                &nbsp;DATE:&nbsp;{this.parseDate(this.props.approvalDate)}
              </p>
            </Col>
            <Col className="pl-4 fw-bold">
              <p className="pr-5 mr-5">&nbsp;REQUIRED:&nbsp;</p>
            </Col>
            <Col className="pl-4 fw-bold">
              <p className="pr-5 mr-5">&nbsp;SHIP:&nbsp;</p>
            </Col>
            <Col className="pl-4 fw-bold">
              <p className="pr-5 mr-5">&nbsp;REQ:&nbsp;</p>
            </Col>
          </Row>
          <div className="tabletall borderup po-tablebox">
            <Row className="center col-13 mb-5 pb-5 tablefont row">
              <Row className="col-12 bg-white table-header center border1">
                <Col lg={3} md={3} sm={3} xs={3} className="borderline">
                  <p>ITEM</p>
                </Col>
                <Col lg={3} md={3} sm={3} xs={4} className="borderline">
                  <p>DESCRIPTION</p>
                </Col>
                <Col lg={2} md={2} sm={2} xs={3} className="borderline">
                  <p>QUANTITY</p>
                </Col>
                <Col lg={3} md={3} sm={2} xs={1} className="borderline">
                  <p>PRICE</p>
                </Col>
                <Col lg={1} md={1} sm={1} xs={1} className="">
                  <p>TOTAL</p>
                </Col>
              </Row>

              {this.props.data.length > 0 &&
                this.props.data.map((row, i) => (
                  <Row key={i} className="bg-light table-header center border1 col-12">
                    <Col lg={3} md={3} sm={3} xs={3} className="borderline">
                      {row.item_name}
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={4} className="borderline">
                      {row.description}
                    </Col>
                    <Col lg={2} md={2} sm={2} xs={3} className="borderline">
                      {row.quantity}
                    </Col>
                    <Col lg={3} md={3} sm={2} xs={1} className="borderline">
                      ${row.unit_price}
                    </Col>
                    <Col lg={1} md={1} sm={1} xs={1} className="">
                      ${row.total_price}
                    </Col>
                  </Row>
                ))}
            </Row>
          </div>
          <div className="borderdn">
            <Row className="right">
              <Col lg={12} md={12} sm={12} xs={12} className="col align-self-end mb-3">
                <span>
                  Shipping and Handling&nbsp;&nbsp;
                  <span className="border4">
                    &nbsp;&nbsp;${this.props.shippingHandling}&nbsp;&nbsp;
                  </span>
                  &nbsp;
                </span>
              </Col>
            </Row>
            <Row className="right">
              <Col lg={12} md={12} sm={12} xs={12} className="col align-self-end mb-3">
                <span>
                  <span className="fw-bold">GRAND TOTAL</span>&nbsp;&nbsp;
                  <span className="border4">
                    &nbsp;&nbsp;$
                    {this.totalTotal(this.props.data, this.props.shippingHandling)}
                    &nbsp;&nbsp;
                  </span>
                  &nbsp;
                </span>
              </Col>
            </Row>
          </div>
          <div>ACCOUNT CODE: {this.props.accountCode}</div>
          <Row className="pt-5 ml-5">
            <Col className="center pt-4">
              <Row className="mt-5 ml-4">
                <small>Received By:</small> ___________________________________________{' '}
                <small>FULL PARTIAL</small>
              </Row>
              <Row className="mt-5 ml-4 pt-4">
                <small>Received By:</small> ___________________________________________{' '}
                <small>FULL PARTIAL</small>
              </Row>
            </Col>
            <Col className="center">
              {this.props.signature && (
                <Row>
                  <small className="col-10 left">
                    The Board of Education will not be responsible for any charges nor for
                    supplies delivered except on purchase order duly executed and signed
                    by the Superintendent.
                  </small>
                  <div>
                    <img src={supersign} className="sig" alt="supervisor signature" />
                    <p>______________________________________________________________</p>
                    <p>SUPERINTENDENT</p>
                    <img src={othersign} className="sig" alt="other signature" />
                    <p>____________________________________________________________</p>
                  </div>
                </Row>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

function PrintIt(props) {
  // console.log(props)
  const componentRef = useRef()

  const closeModal = () => {
    props.onHide()
  }

  return (
    <div className="container pt-2 mt-2">
      <Row>
        <Col className="offset-1 mt-5">
          <ReactToPrint
            trigger={() => (
              <button className="btn-dark btn border1 shadow-sm printbtn">
                <img src={print} id="printicon" title="PRINT" alt="print button icon" />
              </button>
            )}
            content={() => componentRef.current}
          />

          <div
            className="btn-dark btn border1 shadow-sm exitbtn"
            onClick={closeModal}
            title="EXIT"
          >
            EXIT
          </div>
          <div className="printmsg">
            {props.post.quote && (
              <>
                To view quote click{' '}
                <a target="_blank" href={props.post.quote}>
                  here
                </a>
                .
              </>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="left bottom">
          <ReactToPrint
            trigger={() => (
              <button className="btn-dark btn border1 shadow-sm printbtn">
                <img src={print} id="printicon" title="PRINT" alt="print button icon" />
              </button>
            )}
            content={() => componentRef.current}
          />
          <ComponentToPrint
            data={props.post.data}
            approvalDate={props.post.poData.approvalDate}
            poNumber={props.post.poData.poNumber}
            vendorId={props.post.poData.vendorId}
            addressInfo={props.post.poData.addressInfo}
            ref={componentRef}
            accountCode={props.post.poData.accountCode}
            toAddress={props.post.poData.toAddress.split('|')}
            signature={props.post.poData.switch ? false : true}
            shippingHandling={props.post.shippingHandling}
          />

          <div
            className="btn-dark btn border1 shadow-sm exitbtn"
            onClick={closeModal}
            title="EXIT"
          >
            EXIT
          </div>
          <Row>
            <Col className="absolute center bottom left right">
              <img src={poflow1} alt="app logo" />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default PrintIt
