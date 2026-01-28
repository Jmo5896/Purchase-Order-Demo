module.exports = (info, body) => {
  return {
    subject: `Your purchase order has been approved`,
    body: `
           <style>
      body {
        /* background-color: rgb(232, 232, 232); */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 0;
        min-width: 500px;
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
      .detail-button {
        border: none;
        background-color: #0e4b0e;
        padding: 20px 30px;
        border-radius: 50px;
        color: white;
      }
      .detail-button a {
        color: white;
        text-decoration: none;
      }
      .footer-p {
        margin-top: 50px;
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
        <h2 class="main-title">Your purchase order has been approved!</h2>
        <a
            href="https://dcschools.us/poflow/dashboard"
            target="_blank"
            rel="noreferrer"
            >
        <button class="detail-button">
          View Order Detail
        </button>
        </a>
        <p class="footer-p">
          Copyright © ${new Date().getFullYear()} KICKapps POflow
        </p>
      </div>
    </div>
        `
  }
}
