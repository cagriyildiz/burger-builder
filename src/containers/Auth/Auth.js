import React, { Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {

  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          valid: true,
          rules: {
            required: true,
            isEmail: true
          },
          touched: false
        }
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          valid: false,
          rules: {
            required: true,
            minLength: 6
          }
        },
        touched: false
      }
    },
    isSignup: true
  };

  isValid(value, rules) {
    let valid = true;

    if (rules.required) {
      valid = value.trim() !== '' && valid;
    }

    if (rules.minLength) {
      valid = value.length >= rules.minLength && valid;
    }

    if (rules.maxLength) {
      valid = value.length <= rules.maxLength && valid;
    }

    return valid;
  };

  inputChangedHandler = (event, controlName) => {
    
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
          ...this.state.controls[controlName],
          value: event.target.value,
          validation: {
            ...this.state.controls[controlName].validation,
            valid: this.isValid(event.target.value, this.state.controls[controlName].validation.rules),
          },
          touched: true
      }
    };
    this.setState({controls: updatedControls});
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        isSignup: !prevState.isSignup
      }
    });
  }

  render() {
    const formElements = [];
    for (let key in this.state.controls) {
      formElements.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    const form = this.props.loading ? <Spinner /> : formElements.map(element => (
      <Input 
        key={element.id}
        elementType={element.config.elementType}
        elementConfig={element.config.elementConfig}
        value={element.config.value}
        inValid={!element.config.validation.valid}
        touched={element.config.touched}
        changed={(event) => this.inputChangedHandler(event, element.id)}/>
    ));

    let errorMessage = this.props.error ? <p>{this.props.error.message}</p> : null;
    
    return(
      <div className={classes.Auth}>
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button 
          clicked={this.switchAuthModeHandler}
          btnType="Danger">SWITCH TO {this.state.isSignup ? "LOGIN" : "SIGNUP"}</Button>
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
