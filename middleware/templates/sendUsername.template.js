module.exports = (info, body) => {
  return {
    subject: 'Doddridge County Schools Username',
    body: ` <style>
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
        min-width: 500px;
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
        width: 200px;
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
        <h1 class="main-title">Hello ${info.username}</h1>
        <h3 style="margin: 20px 0">Welcome to the KICKapps POflow App!</h3>
        <a
            href="https://dcschools.us/login"
            target="_blank"
            rel="noreferrer"
            style="color: white; text-decoration: none"
            >
        <button class="detail-button">
          LOGIN
        </button>
        </a>

        <p class="footer-p">
          Copyright © ${new Date().getFullYear()} KICKapps POflow
        </p>
      </div>
    </div>
    `
    // attachment: body.bugMedia
  }
}
