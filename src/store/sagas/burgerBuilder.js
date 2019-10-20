import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';

import * as actions from '../actions/index';
import { INGREDIENT_PRICES } from '../reducers/burgerBuilder';


const getTotalPrice = (ingredients) => {
  return Object.keys(ingredients).map((igKey) => {
    return ingredients[igKey] * INGREDIENT_PRICES[igKey];
  }).reduce((sum, el) => {
    return sum + el;
  }, 0);    
};

export function* initIngredientsSaga(action) {
  try {
    const response = yield axios.get('https://react-burger-app-ad6aa.firebaseio.com/ingredients.json');    
    const ingredients = response.data; 
    const ingredientsTotal = yield getTotalPrice(ingredients);
    const sum = ingredientsTotal + action.totalPrice;
    yield put(actions.setIngredients(ingredients, sum));
  } catch(error) {
    yield put(actions.fetchIngredientsFailed());
  }
}
