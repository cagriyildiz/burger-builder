import React, { Component } from 'react';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';

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
    }
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

  render() {
    const formElements = [];
    for (let key in this.state.controls) {
      formElements.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    console.log(formElements);

    const form = formElements.map(element => (
      <Input 
        key={element.id}
        elementType={element.config.elementType}
        elementConfig={element.config.elementConfig}
        value={element.config.value}
        inValid={!element.config.validation.valid}
        touched={element.config.touched}
        changed={(event) => this.inputChangedHandler(event, element.id)}/>
    ));
    return(
      <div className={classes.Auth}>
        <form>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
      </div>
    );
  };
};

export default Auth;
