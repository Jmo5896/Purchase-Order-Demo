import React from 'react'
import { Link } from 'react-router-dom'
import icon from '../../../imgs/orderRejected-icon.svg'
// import API from '../../../services/message.service'
import './templates.css'

export default function PoRejected(props) {
  // const [isLoading, setLoading] = useState(true)

  // useEffect(() => {
  //   let isMounted = true

  //   const fetchData = async () => {
  //     try {
  //       const response = await API.updateRead({ read: true })
  //       // console.log(response.data)
  //       if (isMounted) {
  //         setLoading(false)
  //         // setContent(response.data)
  //       }
  //     } catch (err) {
  //       console.log(err)
  //       // propHistory.push('/login')
  //       // window.location.reload()
  //     }
  //   }
  //   if (isLoading) {
  //     fetchData()
  //   }

  //   return () => {
  //     isMounted = false
  //   }
  // }, [isLoading])
  // console.log(props)
  return (
    <div
    // aria-live="assertive"
    // aria-atomic="true"
    // style="position: relative; top: 0; height: 100%; overflow: hidden"
    >
      <div
        // style="border-top: 10px solid #000000; text-align: center"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <img
          // style="width: 100; height: auto; margin-left: auto; margin-right: auto"
          alt="logo"
          // src="https://dc-schools-s3.s3.us-east-2.amazonaws.com/dcschools/client/src/imgs/logo192.png"
          style={{ width: '100px', height: '100px', margin: '10px 0' }}
          src={icon}
        />
        <h3 style={{ margin: '10px 0', fontWeight: 'bold' }}>
          Your purchase order has been rejected
        </h3>

        {/* <h2
        // style="border-top: 2px solid #0e4b0e; padding: 2%"
        >
          Click <Link to="/poflow/dashboard/myrejected">here</Link>
          {/* <a
            href="https://dcschools.us/poflow/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a> */}
        {/* , to view and edit or delete your rejected purchase order.
        </h2> */}
        <Link to="/poflow/dashboard/myrejected">
          <button className="model-button">View Order Detail</button>
        </Link>

        <p style={{ marginTop: '20px' }}>
          Copyright © {new Date().getFullYear()} KICKapps POflow
        </p>
      </div>
    </div>
  )
}
