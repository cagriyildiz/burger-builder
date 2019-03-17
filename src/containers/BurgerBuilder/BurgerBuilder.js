import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('https://react-burger-app-ad6aa.firebaseio.com/ingredients.json')
    .then(response => {
      const ingredients = response.data;
      const sum = this.getIngredientCount(ingredients);
      this.setState({ingredients: ingredients, purchasable: sum > 0});
    })
    .catch(error => {
      this.setState({error: true});
    });
  }

  updatePurchaseState = (ingredients) => {
    const sum = this.getIngredientCount(ingredients);
    this.setState({purchasable: sum > 0});
  }

  getIngredientCount =(ingredients) => {
    return Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
  }

  updatePrice = (type, operation) => {
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    return operation === 'add' ? oldPrice + priceDeduction : oldPrice - priceDeduction;    
  }

  updateIngredients = (type, operation) => {
    const oldCount = this.state.ingredients[type];
    if (operation === 'remove' && oldCount <= 0) {
      return;
    }
    const updatedCount = operation === 'add' ? oldCount + 1 : oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    return updatedIngredients;
  }

  addIngredientHandler = (type) => {
    const operation = 'add';
    const updatedIngredients = this.updateIngredients(type, operation);
    const newPrice = this.updatePrice(type, operation);
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const operation = 'remove';
    const updatedIngredients = this.updateIngredients(type, operation);
    const newPrice = this.updatePrice(type, operation);
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Cagri Yildiz',
        address: {
          street: 'Test street',
          zipCode: '35100',
          country: 'Turkey'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'quick'
    };
    axios.post('/order.json', order)
      .then(response => this.setState({loading: false, purchasing: false}))
      .catch(response => this.setState({loading: false, purchasing: false}));
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls 
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = <OrderSummary 
        ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        price={this.state.totalPrice}/>;
    }
    if (this.state.loading) {
      orderSummary = <Spinner />
    }
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
