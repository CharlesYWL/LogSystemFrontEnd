import React, { Component } from "react";
import fire from "./config/Fire";
import "./App.css";
import Dashboard from "./components/Dashboard/dashboard";
import { Login, Register } from "./components/Login/index";
import { Snackbar } from "@material-ui/core";
import MySnackbarContentWrapper from "./components/SnackBar/mySnackbarContentWrapper";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true,
      user: {},
      snackBarOpen: false,
      snackBarType: "info",
      snackBarMessage: "test"
    };
  }

  render() {
    let content = null;
    const { user } = this.state;
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Register" : "Login";
    const currentActive = isLogginActive ? "login" : "register";
    if (user) {
      content = <Dashboard parentCallback={this.callbackFunction} />;
    } else {
      content = (
        <div className="App">
          <div className="login">
            <div className="container">
              {!user && isLogginActive && (
                <Login
                  containerRef={ref => (this.current = ref)}
                  parentCallback={this.callbackFunction}
                />
              )}
              {!user && !isLogginActive && (
                <Register
                  containerRef={ref => (this.current = ref)}
                  parentCallback={this.callbackFunction}
                />
              )}
            </div>
            <RightSide
              current={current}
              containerRef={ref => (this.rightSide = ref)}
              onClick={this.changeState.bind(this)}
            />
          </div>
        </div>
      );
    }
    return (
      <div>
        {content}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={this.state.snackBarOpen}
          autoHideDuration={5000}
          onClose={this.handleClose}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant={this.state.snackBarType}
            message={this.state.snackBarMessage}
          />
        </Snackbar>
      </div>
    );
  }
  // callbackFunction is used for getting data from children
  // Parameter:
  callbackFunction = (type, message) => {
    this.setState({
      snackBarOpen: true,
      snackBarType: type,
      snackBarMessage: message
    });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false, snackBarOpen: false });
  };

  componentDidMount() {
    this.authListener();
  }
  authListener() {
    fire.auth().onAuthStateChanged(user => {
      //console.log(user);
      if (user) {
        this.setState({ user });
        //localStorage.setItem('user',user.uid);
      } else {
        this.setState({ user: null });
        //localStorage.removeItem('user');
      }
    });
  }

  changeState() {
    const { isLogginActive } = this.state;
    if (isLogginActive) {
      this.rightSide.classList.remove("right");
      this.rightSide.classList.add("left");
    } else {
      this.rightSide.classList.remove("left");
      this.rightSide.classList.add("right");
    }
    this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }
}

const RightSide = props => {
  return (
    <div
      className="right-side"
      ref={props.containerRef}
      onClick={props.onClick}
    >
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
};

export default App;
