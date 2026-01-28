module.exports = (info, body) => {
  // console.log('======================')
  // console.log('info: ', info)
  // console.log('body: ', body)
  // console.log('======================')
  let grandTotal = body.shippingHandling
  const lineItems = body.items.map((obj) => {
    // item_name, description, unit_price, quantity, total_price
    grandTotal += obj.total_price

    const template = `
    <tr>
    <td>${obj.item_name}</td>
    <td>${obj.description}</td>
    <td>${obj.unit_price}</td>
    <td>${obj.quantity}</td>
    <td>${obj.total_price}</td>
    </tr>\n
    `
    return template
  })
  return {
    subject: `Requisition information for Purchase order from ${body.name}.`,
    body: `
 <style>
      body {
        /* background-color: rgb(232, 232, 232); */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 0;
      }
      .email-frame {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 20px;
        background-color: white;
        box-shadow: 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
        width: 100%;
      }
      .dc-logo {
        width: 200px;
        margin-bottom: 15px;
      }
      .line {
        border: 5px solid #000000;
        width: 100%;
      }
      .bulldog-logo {
        width: 100;
        margin: 15px;
      }
      .main-title {
        margin: 20px 0;
      }
      .detail-button a {
        color: white;
        text-decoration: none;
      }
      .footer-p {
        margin-top: 50px;
      }
      .info-frame {
        /* background-color: #0e4b0e44; */
        /* background-color: rgb(179, 178, 178); */
        padding: 20px 20px;
        border: 5px solid #0e4b0e;
        border-radius: 20px;
      }
      .info-frame .top,
      .bottom {
        display: flex;
        justify-content: space-between;
      }
      table {
        width: 100%;
      }
      .detail-button {
        width: 200px;
        border: none;
        background-color: #0e4b0e;
        padding: 20px 30px;
        border-radius: 50px;
        color: white;
        margin: 30px 0;
      }
      .detail-button a {
        color: white;
        text-decoration: none;
      }
       .hightlight {
        color: red;
        font-style: italic;
      }
    </style>
    <div aria-live="assertive" aria-atomic="true">
      <div class="email-frame">
      <img
          class="dc-logo"
          src="https://files.dcschools.us/dcschools/client/src/imgs/dc-logo.png"
        />
        <div class="line"></div>
        <img
          class="bulldog-logo"
          src="https://files.dcschools.us/dcschools/client/src/imgs/logo192.png"
        />
        <h2 class="main-title">
          Account Code: (This may be notes from finance)
        </h2>
        <div class="info-frame">
          <div class="top">
            <div style="margin-right: 50px">
              <h3>Name: ${body.accountCode.name}</h3>
              <h3>Code: ${body.accountCode.code}</h3>
            </div>
            <div style="margin-left: 50px">
              <h3>Staffer: ${body.name}</h3>
              <h3>Email: ${body.email}</h3>
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-wrap: wrap;
              margin-right: -15px;
              margin-left: -15px;
              padding-top: 10px;
            "
          >
            <div
              style="
                padding: 0px 20px;
                text-align: left;
                flex-basis: 0;
                flex-grow: 1;
                max-width: 100%;
              "
            >
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItems.join('')}
                </tbody>
              </table>
            </div>
          </div>
          <br /><br />
          <div class="bottom">
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                margin-right: -15px;
                margin-left: -15px;
                padding-top: 10px;
              "
            >
              <div
                style="
                  flex-basis: 0;
                  flex-grow: 1;
                  max-width: 100%;
                  padding-left: 20px;
                  text-align: left;
                  margin-right: 50px;
                "
              >
                Shipping and Handling: ${body.shippingHandling}
              </div>
            </div>
            <br /><br />
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                margin-right: -15px;
                margin-left: -15px;
                padding-top: 10px;
              "
            >
              <div style="flex-basis: 0; flex-grow: 1; max-width: 100%">
                <span style="padding-left: 20px; text-align: left"
                  >Grand Total: ${grandTotal}</span
                >
              </div>
            </div>
          </div>

          <br /><br />
          <div
            style="
              display: flex;
              flex-direction: column;
              width: 100%;
              align-items: center;
            "
          >
            <span
              style="padding-left: 20px; text-align: left; align-self: start"
              >Vendor Name: ${body.vendor} (${body.vendorId})</span
            >
            <span
              style="padding-left: 20px; text-align: left; align-self: start"
              >Notes: ${body.notes || 'No notes on purchase order'}</span
            >
          </div>
          </div>
          <br /><br />
          <h2 class="hightlight">
          After the order is inputted into WVEIS, email Accounts Payable that the order has been completed
        </h2>
          ${
            body.quote
              ? `
            <a
                href="${body.quote}"
                target="_blank"
                >
            <button class="detail-button">
              View Quote
            </button>
            </a
              >
            `
              : ''
          }
        <p class="footer-p">
          Copyright © ${new Date().getFullYear()} Doddridge County Schools
        </p>
      </div>
    </div>
    `
  }
}
