import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import API from '../../../services/bug.service'
import Loading from '../../Loading'

export default function SupportForm(props) {
  const [validated, setValidated] = useState(false)
  const [characters, setCharacters] = useState('')
  const [isLoading, setLoading] = useState(false)

  const onCharChange = (e) => {
    setCharacters(e.target.value)
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    let formDataObj = Object.fromEntries(formData.entries())

    const fileURLS = async (data, keyName) => {
      const newData = { ...data }
      if (formDataObj[keyName].name) {
        const fileData = new FormData()
        const newName = formDataObj[keyName].name
          .split('')
          .map((char) =>
            char === ' ' || char === '&' || char === '%' || char === '#' ? '_' : char
          )
          .join('')
        fileData.append('media', formDataObj[keyName], newName)
        setLoading(true)
        const file = await API.media(fileData)
        newData[keyName] = file.data
      } else {
        delete newData[keyName]
      }
      return newData
    }

    const data = await fileURLS(formDataObj, 'bugMedia')
    setLoading(false)
    const sendData = async (data) => {
      props.onHide()
      API.bugReport(data)
      props.post.setLoading(true)
    }
    const form = e.target
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      setCharacters('')
      setValidated(false)
      sendData(data)
    }
  }

  const closeModal = () => {
    props.onHide()
    setValidated(false)
    setCharacters('')
  }

  return (
    <>
      {isLoading && <Loading />}
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <Form.Group>
          <Form.Label>Select the device the issue occured on:</Form.Label>
          <Form.Control required name="device" as="select">
            <option>Mobile</option>
            <option>Tablet</option>
            <option>Laptop</option>
            <option>Desktop</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Select the operating system of your device:</Form.Label>
          <Form.Control required name="os" as="select">
            <option>Android</option>
            <option>iOS</option>
            <option>Windows</option>
            <option>MacOS</option>
            <option>Linux</option>
            <option>ChromeOS</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Select the browser that the bug occured on:</Form.Label>
          <Form.Control required name="browser" as="select">
            <option>Google Chrome</option>
            <option>Safari</option>
            <option>Edge</option>
            <option>Firefox</option>
            <option>Internet Explorer</option>
            <option>Opera</option>
            <option>Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Please describe the bug you have encountered:</Form.Label>
          <Form.Control
            required
            spellCheck="true"
            name="description"
            as="textarea"
            rows={4}
            cols={50}
            maxLength={500}
            onChange={onCharChange}
          />
          <p>{characters.split('').length}/500</p>
          <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Please enter a description of the error to continue.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="col-sm-12 col-lg-10 media-target">
          <Form.Label htmlFor="bugMedia-upload">
            Upload a video of the bug OR a screen shot:
          </Form.Label>
          <Form.Control
            name="bugMedia"
            type="file"
            className="form-control-file"
            id="bugMedia-upload"
            isValid={true}
          />
        </Form.Group>
        <div className="row">
          <Button variant="success m-2 " size="lg" type="submit">
            Submit
          </Button>
          <Button variant="warning m-2 " size="lg" onClick={closeModal} type="button">
            Exit
          </Button>
        </div>
      </Form>
    </>
  )
}
