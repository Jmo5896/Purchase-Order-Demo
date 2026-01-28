module.exports = (info, body) => {
  return {
    subject: "Doddridge County Schools Bug Report",
    body: `
     <style>
      body {
        /* background-color: rgb(232, 232, 232); */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px 0;
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
        <h1 class="main-title">This is a bug report from ${info.username}</h1>
        <div
          style="
            /* background-color: #0e4b0e44; */
            /* background-color: rgb(179, 178, 178); */
            padding: 20px 20px;
            border-radius: 20px;
          "
        >
          <h3 style="padding-top: 2%">Device: ${body.device}</h3>
          <h3 style="padding-top: 2%">OS: ${body.os}</h3>
          <h3 style="padding-top: 2%">Browser: ${body.browser}</h3>
          <h3 style="padding-top: 2%">Description: ${body.description}</h3>
          <h3 style="padding-top: 2%">
            ${
              body.bugMedia
                ? `<img
              src="${body.bugMedia}"
              alt="bug s creen shot"
            />`
                : "<h5>no picture provided</h5>"
            }</h3>
        </div>

        <p class="footer-p">
          Copyright © ${new Date().getFullYear()} KICKapps POflow
        </p>
      </div>
    </div>`,
    // attachment: body.bugMedia
  };
};
