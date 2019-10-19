import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import { updateObject, isValid } from '../../shared/utility';

const auth = (props) => {

  const [authForm, setAuthForm] = useState({
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
  });
  const [isSignup, setIsSignup] = useState(true);

  const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath();
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm, {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        validation: updateObject(authForm[controlName].validation, {
          valid: isValid(event.target.value, authForm[controlName].validation.rules)
        }),
        touched: true
      })
    });
    setAuthForm(updatedControls);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAuth(authForm.email.value, authForm.password.value, isSignup);
  };

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup);
  };

  const formElements = [];
  for (let key in authForm) {
    formElements.push({
      id: key,
      config: authForm[key]
    });
  }

  const form = props.loading ? <Spinner /> : formElements.map(element => (
    <Input 
      key={element.id}
      elementType={element.config.elementType}
      elementConfig={element.config.elementConfig}
      value={element.config.value}
      inValid={!element.config.validation.valid}
      touched={element.config.touched}
      changed={(event) => inputChangedHandler(event, element.id)}/>
  ));

  const errorMessage = props.error ? <p>{props.error.message}</p> : null;
  const authRedirect = props.isAuthenticated ? <Redirect to={props.authRedirectPath} /> : null;
  
  return(
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button 
        clicked={switchAuthModeHandler}
        btnType="Danger">SWITCH TO {isSignup ? "LOGIN" : "SIGNUP"}</Button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token != null,
    authRedirectPath: state.auth.authRedirectPath,
    buildingBurger: state.burgerBuilder.building
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(auth);
