import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import { INGREDIENT_PRICES } from '../reducers/burgerBuilder';

export const addIngredient = name => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name
  }
};

export const removeIngredient = name => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name
  }
};

const getTotalPrice = (ingredients) => {
  return Object.keys(ingredients).map((igKey) => {
    return ingredients[igKey] * INGREDIENT_PRICES[igKey];
  }).reduce((sum, el) => {
    return sum + el;
  }, 0);    
};

export const setIngredients = (ingredients, totalPrice) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients,
    totalPrice: totalPrice
  };
};

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  };
};

export const initIngredients = () => {
  return (dispatch, getState) => {
    axios.get('https://react-burger-app-ad6aa.firebaseio.com/ingredients.json')
      .then(response => {
        const ingredients = response.data; 
        const ingredientsTotal = getTotalPrice(ingredients);
        const sum = ingredientsTotal + getState().totalPrice;
        dispatch(setIngredients(ingredients, sum));
      })
      .catch(error => {
        dispatch(fetchIngredientsFailed());
      });
  };
}
