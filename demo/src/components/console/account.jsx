import React from 'react';
import { Button, Form, Alert } from 'react-bootstrap';

import './styles.sass';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordRetype: '',
      isRegister: false,
      msgs: []
    };
  }
  
  /* FROM PARENT
    firebase
  */
  
  appendMsgs = (msg) => {
    this.setState({
      msgs: this.state.msgs.concat(msg)
    }, () => {setTimeout(() => {
      this.setState({
        msgs: this.state.msgs.splice(1, this.state.msgs.length-1)
      });
    }, 0)});
  }
  
  onInputChange = (e) => {
    this.setState({[e.target.id]: e.target.value});
    console.log(this.state);
  }
  
  onFormSubmit = () => {
    const {email, password, passwordRetype} = this.state;
    if (this.state.isRegister) {
      this.props.firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {})
        .catch(err => {
          this.appendMsgs(err.message);
        });
    } else {
      this.props.firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {})
        .catch(err => {
          this.appendMsgs(err.message);
        });
    }
  }
  
  onRmMsg = (msgToRm) => {
    this.setState({
      msgs: this.state.msgs.filter(msg => msg !== msgToRm)
    });
  } 
  
  render = () => {
    return (
      <Form className="account">
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={this.state.email}
            onChange={this.onInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.onInputChange}
            required
          />
        </Form.Group>
        {this.state.isRegister &&
          <Form.Group controlId="passwordRetype">
            <Form.Label>Retype Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Retype Password"
              value={this.state.passwordRetype}
              onChange={this.onInputChange}
              required
            />
          </Form.Group>
        }
        <Button variant="primary" onClick={() => this.onFormSubmit()}>
          {this.state.isRegister ? "Register" : "Login"}
        </Button>
        {this.state.isRegister ? 
          <Button
            variant="link"
            onClick={() => this.setState({isRegister: false})}
          >
            To Login
          </Button>
          :
          <Button
            variant="link"
            onClick={() => this.setState({isRegister: true})}
          >
            To register
          </Button>
        }
        {this.state.msgs.map(((msg, idx) => (
          <Alert key={idx} variant="danger">{msg}</Alert>
        )))}
      </Form>
    ); 
  }
  
}

export default Account;