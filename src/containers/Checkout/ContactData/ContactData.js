import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {

  state = {
    orderForm: {
        name: this.createFormObject('input', 'text', 'Your Name', null, ''),
        street: this.createFormObject('input', 'text', 'Street', null, ''),
        zipCode: this.createFormObject('input', 'text', 'ZIP Code', null, ''),
        country: this.createFormObject('input', 'text', 'Country', null, ''),
        email: this.createFormObject('input', 'email', 'E-mail', null, ''),
        deliveryMethod: this.createFormObject('select', null, null, [
          {value: 'express', displayValue: 'Express'},
          {value: 'economic', displayValue: 'Economic'}
        ], '')
    },
    loading: false
  }

  createFormObject(inElementType, inConfigType, inConfigPlaceholder, inConfigOptions, inValue) {
    let obj;
    switch (inElementType) {
      case 'input':
        obj = {
          elementType: inElementType,
          elementConfig: {
            type: inConfigType,
            placeholder: inConfigPlaceholder
          },
          value: inValue
        };
        break;
      case 'select':
        obj = {
          elementType: inElementType,
          elementConfig: {
            options: inConfigOptions
          },
          value: inValue
        };
        break;
      default:
        obj = {
          elementType: inElementType,
          elementConfig: {
            type: inConfigType,
            placeholder: inConfigPlaceholder
          },
          value: inValue
        };
    }
    return obj;
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
    };
    axios.post('/orders.json', order)
      .then(response => {
        this.setState({loading: false});
        this.props.history.push('/');
      })
      .catch(response => this.setState({loading: false}));
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.value;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    this.setState({orderForm: updatedOrderForm});
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
      <form>
        {formElements.map(element => (
          <Input 
            key={element.id}
            elementType={element.config.elementType}
            elementConfig={element.config.elementConfig}
            value={element.config.value}
            changed={(event) => this.inputChangedHandler(event, element.id)}/>
        ))}
        <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
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

export default ContactData;
