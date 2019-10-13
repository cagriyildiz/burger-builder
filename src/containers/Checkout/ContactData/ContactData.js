import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {

  state = {
    orderForm: {
        name: this.createFormObject('input', 'text', 'Your Name', null, '', {required: true}),
        street: this.createFormObject('input', 'text', 'Street', null, '', {required: true}),
        zipCode: this.createFormObject('input', 'text', 'ZIP Code', null, '', {required: true, minLength: 5, maxLength: 5}),
        country: this.createFormObject('input', 'text', 'Country', null, '', {required: true}),
        email: this.createFormObject('input', 'email', 'E-mail', null, '', {required: true}),
        deliveryMethod: this.createFormObject('select', null, null, [
          {value: 'express', displayValue: 'Express'},
          {value: 'economic', displayValue: 'Economic'}
        ], 'express', {})
    },
    formIsValid: false
  }

  createFormObject(inElementType, inConfigType, inConfigPlaceholder, inConfigOptions, inValue, inValidationRules) {
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
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      orderData: formData
    };
    this.props.onOrderBurger(order, this.props.token);
  }

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
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };

    updatedFormElement.value = event.target.value;
    updatedFormElement.validation.valid = this.isValid(updatedFormElement.value, updatedFormElement.validation.rules);
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;

    let formIsValid = true;
    for (let i in updatedOrderForm) {
      formIsValid = updatedOrderForm[i].validation.valid && formIsValid;
    }
    
    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
  }

  render() {
    const formElements = [];
    for (let key in this.state.orderForm) {
      formElements.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElements.map(element => {
          
          return (
            <Input 
              key={element.id}
              elementType={element.config.elementType}
              elementConfig={element.config.elementConfig}
              value={element.config.value}
              inValid={!element.config.validation.valid}
              touched={element.config.touched}
              changed={(event) => this.inputChangedHandler(event, element.id)}/>
          )
        })}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Personal Information</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => {dispatch(actions.purchaseBurger(orderData, token))}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
