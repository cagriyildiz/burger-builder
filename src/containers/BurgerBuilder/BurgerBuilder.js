import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

const burgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);

  const {onInitIngredients} = props;
  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const getTotalIngredientCount = (ingredients) => {
    return Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
  };

  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath('/checkout');
      props.history.push("/auth");
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    props.onPurchaseInit();
    props.history.push('/checkout');
  };
  
  const disabledInfo = {
    ...props.ingredients
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  let orderSummary = null;
  let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
  if (props.ingredients) {
    burger = (
      <Aux>
        <Burger ingredients={props.ingredients} />
        <BuildControls 
          ingredientAdded={props.onIngredientAdded}
          ingredientRemoved={props.onIngredientRemoved}
          disabled={disabledInfo}
          price={props.totalPrice}
          isAuthenticated={props.isAuthenticated}
          purchasable={getTotalIngredientCount(props.ingredients)}
          ordered={purchaseHandler}
        />
      </Aux>
    );
    orderSummary = <OrderSummary 
      ingredients={props.ingredients}
      purchaseCancelled={purchaseCancelHandler}
      purchaseContinued={purchaseContinueHandler}
      price={props.totalPrice}/>;
  }
  
  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token != null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingredient) => dispatch(actions.addIngredient(ingredient)),
    onIngredientRemoved: (ingredient) => dispatch(actions.removeIngredient(ingredient)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onPurchaseInit: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));
