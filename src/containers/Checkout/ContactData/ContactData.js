import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, isValid } from '../../../shared/utility';

const createFormObject = (inElementType, inConfigType, inConfigPlaceholder, 
                          inConfigOptions, inValue, inValidationRules) => {
  let obj;
  switch (inElementType) {
    case 'input':
      obj = {
        elementType: inElementType,
        elementConfig: {
          type: inConfigType,
          placeholder: inConfigPlaceholder
        },
        value: inValue,
        validation: {
          valid: false,
          rules: inValidationRules
        },
        touched: false
      };
      break;
    case 'select':
      obj = {
        elementType: inElementType,
        elementConfig: {
          options: inConfigOptions
        },
        value: inValue,
        validation: {
          valid: true,
          rules: inValidationRules
        },
        touched: false
      };
      break;
    default:
      obj = {
        elementType: inElementType,
        elementConfig: {
          type: inConfigType,
          placeholder: inConfigPlaceholder
        },
        value: inValue,
        validation: {
          valid: false,
          rules: inValidationRules
        },
        touched: false
      };
  }
  return obj;
};

const contactData = (props) => {

  const [orderForm, setOrderForm] = useState({
    name: createFormObject('input', 'text', 'Your Name', null, '', {required: true}),
    street: createFormObject('input', 'text', 'Street', null, '', {required: true}),
    zipCode: createFormObject('input', 'text', 'ZIP Code', null, '', {required: true, minLength: 5, maxLength: 5}),
    country: createFormObject('input', 'text', 'Country', null, '', {required: true}),
    email: createFormObject('input', 'email', 'E-mail', null, '', {required: true}),
    deliveryMethod: createFormObject('select', null, null, [
      {value: 'express', displayValue: 'Express'},
      {value: 'economic', displayValue: 'Economic'}
    ], 'express', {})
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const orderHandler = (event) => {
    event.preventDefault();
    
    const formData = {};
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }
    const order = {
      ingredients: props.ingredients,
      price: props.price,
      orderData: formData,
      userId: props.userId
    };
    props.onOrderBurger(order, props.token);
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(orderForm[inputIdentifier], {
      value: event.target.value,
      validation: updateObject(orderForm[inputIdentifier].validation, {
        valid: isValid(event.target.value, orderForm[inputIdentifier].validation.rules)
      }),
      touched: true
    });
    const updatedOrderForm = updateObject(orderForm, {
      [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let i in updatedOrderForm) {
      formIsValid = updatedOrderForm[i].validation.valid && formIsValid;
    }
    setOrderForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  const formElements = [];
  for (let key in orderForm) {
    formElements.push({
      id: key,
      config: orderForm[key]
    });
  }

  let form = (
    <form onSubmit={orderHandler}>
      {formElements.map(element => {
        
        return (
          <Input 
            key={element.id}
            elementType={element.config.elementType}
            elementConfig={element.config.elementConfig}
            value={element.config.value}
            inValid={!element.config.validation.valid}
            touched={element.config.touched}
            changed={(event) => inputChangedHandler(event, element.id)}/>
        )
      })}
      <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }
  return (
    <div className={classes.ContactData}>
      <h4>Personal Information</h4>
      {form}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => {dispatch(actions.purchaseBurger(orderData, token))}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(contactData, axios));
