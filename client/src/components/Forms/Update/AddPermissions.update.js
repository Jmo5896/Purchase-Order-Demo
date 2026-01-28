import React, { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'

import API from '../../../services/user.service'
import Loading from '../../Loading'

export default function AddUserPermissionsForm(props) {
  const [validated, setValidated] = useState(false)
  const [first, setFirst] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [pages, setPages] = useState({})
  const [userPermissions, setUserPermissions] = useState({ original: [], updated: [] })

  useEffect(() => {
    if (props.formLoad === true && first === true) {
      setLoading(true)
      setFirst(false)
    }
    const fetchData = async () => {
      const response = await API.getPages({ nanoid: props.post.id })
      setLoading(false)
      setPages(response.data.pages)
      setUserPermissions({
        original: [...response.data.userPages],
        updated: [...response.data.userPages]
      })
    }
    if (isLoading) {
      fetchData()
    }
  }, [isLoading, props, first])

  const onFormSubmit = (e) => {
    e.preventDefault()

    const data = {
      id: props.post.id,
      pages: { ...userPermissions }
    }
    const sendData = async (data) => {
      props.onHide()
      await API.addPermissions(data)
      props.post.setLoading(true)
    }
    const form = e.target
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
      setValidated(true)
    } else {
      setValidated(false)
      sendData(data)
    }
  }

  const closeModal = () => {
    props.onHide()
    const perms = { ...userPermissions }
    perms.updated = [...perms.original]
    setValidated(false)
    setUserPermissions(perms)
    setLoading(true)
  }

  const labelCreator = (letter) => {
    // LOOK HERE TO CHANGE TITLES!!!!!
    if (letter === 'H') {
      return 'High school Pages'
    } else if (letter === 'M') {
      return 'Middle school Pages'
    } else if (letter === 'E') {
      return 'Elementary school Pages'
    } else if (letter === 'P') {
      return 'Preschool Pages'
    } else {
      return 'County Pages'
    }
  }

  const handleCheck = (e) => {
    const permissions = { ...userPermissions }
    const input = e.target.name
    if (permissions.updated.includes(input)) {
      const index = permissions.updated.indexOf(input)
      permissions.updated.splice(index, 1)
    } else {
      permissions.updated.push(input)
    }
    setUserPermissions(permissions)
  }

  const generateFormGroups = (obj) => {
    return (
      <div className="row">
        {Object.keys(obj).map((item, i) => (
          <Form.Group className="col" key={i}>
            <Form.Label>
              <b>{labelCreator(item)}</b>
            </Form.Label>
            {obj[item].map((p, j) => (
              <Form.Check
                checked={userPermissions.updated.includes(p)}
                onChange={handleCheck}
                key={j}
                name={p}
                type="checkbox"
                label={p}
              />
            ))}
          </Form.Group>
        ))}
      </div>
    )
  }

  return (
    <div className="edit-permissions">
      {isLoading && <Loading />}
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <div className="container-fluid">{generateFormGroups(pages)}</div>
        <Button variant="success m-2" type="submit">
          Submit
        </Button>
        <Button variant="warning m-2" onClick={closeModal} type="button">
          Exit
        </Button>
      </Form>
    </div>
  )
}
