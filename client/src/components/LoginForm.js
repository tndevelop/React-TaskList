import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";

function LoginForm(props) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const validString = (str) => {
    return str.length !== 0 && str.search(/^\s+$/gm) === -1;
  };

  const tryLogin = (event) => {
    event.preventDefault();
    if (!validString(userName) || !validString(password)) return;

    setMessage("");

    let response = props.login(userName, password);

    setMessage(response);
  };

  return (
    <Row className="below-nav">
      <Col sm="4"></Col>
      <Form as={Col}>
        {message !== "" ? <Alert variant="danger">{message}</Alert> : ""}
        <Form.Group controlId="email">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter username"
            value={userName}
            onChange={(ev) => setUsername(ev.target.value)}
            isInvalid={!validString(userName)}
          />
          <Form.Control.Feedback type="invalid">
            Email must be not empty
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            isInvalid={!validString(password)}
          />
          <Form.Control.Feedback type="invalid">
            Password must be not empty
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={tryLogin}>
          Login
        </Button>
      </Form>
      <Col sm="4"></Col>
    </Row>
  );
}

function LogoutButton(props) {
  <Row className="below-nav">
    <Col sm="4"></Col>
    <Button variant="danger" as={Col} onClick={props.logout}>
      Logout
    </Button>
    <Col sm="4"></Col>
  </Row>;
}

export { LoginForm, LogoutButton };
