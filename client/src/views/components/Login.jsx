/* eslint-disable no-undef */
import React, { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from 'reactstrap'

const Login = () => {
  const [passwordVerification, setPasswordVerification] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isAuthenticated, setAuthenticated] = useState(false)
  const { email, password } = formData

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    const body = {
      email: formData.email,
      password: formData.password,
    }
    await axios
      .post('/api/auth/login', body)
      .then((response) => {
        if (response.data.token) {
          setPasswordVerification(false)
          localStorage.setItem('user', JSON.stringify(response.data.token))
          localStorage.setItem(
            'permission',
            JSON.stringify(response.data.permission),
          )
          setAuthenticated(true)
        }
      })
      .catch((error) => {
        setPasswordVerification(true)
        console.error(error)
      })
  }

  // redirect when logged in
  if (isAuthenticated) {
    return <Redirect to="/admin" />
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>
            <Form className="form" onSubmit={(e) => onSubmit(e)}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => onChange(e)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => onChange(e)}
                    minLength="8"
                  />
                </InputGroup>
                <br />
                {passwordVerification && (
                  <div class="alert alert-danger" role="alert">
                    Incorrect Password
                  </div>
                )}
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6" />
          <Col className="text-right" xs="6">
            <a className="text-light" href="/auth/register">
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  )
}

export default Login
