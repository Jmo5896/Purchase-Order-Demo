import React, { useState } from 'react'

import { Button, Form, Alert } from 'react-bootstrap'

import API from '../../../services/details.service'
import Loading from '../../Loading'

export default function UpdateUserDetailsForm(props) {
  const [validated, setValidated] = useState(false)
  const [characters, setCharacters] = useState(
    props.post.courses_role ? props.post.courses_role : ''
  )
  const [isLoading, setLoading] = useState(false)

  const onCharChange = (e) => {
    setCharacters(e.target.value)
  }

  const checkEntry = (futureData) => {
    const tempData = { ...futureData }
    for (const v of Object.values(tempData)) {
      if (v) {
        setValidated(false)
        return true
      }
    }
    return false
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formDataObj = Object.fromEntries(formData.entries())

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
        const file = await API.media(fileData, keyName)
        newData[keyName] = file.data
        newData[`old${keyName}`] = props.post[keyName]
      } else {
        newData[keyName] = props.post[keyName]
      }
      return newData
    }

    let data = {
      courses_role: formDataObj.courses_role.trim(),
      firstName: formDataObj.firstName,
      subject_grade: formDataObj.subject_grade,
      lastName: formDataObj.lastName,
      prefix: formDataObj.prefix
    }
    data = await fileURLS(data, 'avatarURL')
    data = await fileURLS(data, 'backgroundURL')
    data = await fileURLS(data, 'sigURL')
    setLoading(false)

    const sendData = async (data) => {
      props.onHide()
      await API.update(data)
      props.post.setLoading(true)
    }
    const form = e.target
    if (form.checkValidity() === false || !checkEntry(data)) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      setCharacters(props.post ? props.post.courses_role : '')
      setValidated(false)
      sendData(data)
    }
  }

  const closeModal = () => {
    props.onHide()
    setCharacters(props.post ? props.post.courses_role : '')
    setValidated(false)
  }

  return (
    <>
      {isLoading && <Loading />}
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <div className="row">
          <Form.Group className="col-sm-12 col-lg-10 avatarURL-target">
            <Form.Label htmlFor="avatarURL-upload">Upload Avatar:</Form.Label>
            <Form.Control
              name="avatarURL"
              type="file"
              className="form-control-file"
              id="avatarURL-upload"
              isValid={true}
            />
          </Form.Group>
          <Form.Group className="col-sm-12 col-lg-10 backgroundURL-target">
            <Form.Label htmlFor="backgroundURL-upload">Upload Signature:</Form.Label>
            <Form.Control
              name="backgroundURL"
              type="file"
              className="form-control-file"
              id="backgroundURL-upload"
              isValid={true}
            />
          </Form.Group>

          <Form.Group className="col-sm-12 col-lg-10">
            <Form.Label>Prefix:</Form.Label>
            <Form.Control
              // required
              name="prefix"
              as="select"
              defaultValue={props.post && props.post.prefix}
            >
              <option>Chef</option>
              <option>Dr.</option>
              <option>Mr.</option>
              <option>Mrs.</option>
              <option>Ms.</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-sm-12 col-lg-10">
            <Form.Label>Subject/Grade:</Form.Label>
            <Form.Control
              name="subject_grade"
              as="input"
              maxLength={30}
              defaultValue={props.post ? props.post.subject_grade : ''}
            />
          </Form.Group>
          <Form.Group className="col-sm-12 col-lg-10">
            <Form.Label>Classes/Role:</Form.Label>
            <Form.Control
              spellCheck="true"
              name="courses_role"
              as="textarea"
              rows={4}
              cols={50}
              maxLength={500}
              defaultValue={props.post ? props.post.courses_role : ''}
              onChange={onCharChange}
            />
            <p>{characters.split('').length}/500</p>
          </Form.Group>
        </div>
        {validated && (
          <Alert variant="danger">
            Missing required fields or nothing has been entered.
          </Alert>
        )}
        <Button variant="success m-2" type="submit" onClick={checkEntry}>
          Submit
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Exit
        </Button>
      </Form>
    </>
  )
}
