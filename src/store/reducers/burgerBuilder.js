import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false
};

export const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 0.7,
  cheese: 0.4,
  meat: 1.3
};

const addOrRemoveIngredient = (state, ingredientName, operation) => {
  const updatedIngredient = operation === "add" ? 
    {[ingredientName]: state.ingredients[ingredientName] + 1} : 
    {[ingredientName]: state.ingredients[ingredientName] - 1};
  const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
  const updatedState = {
    ingredients: updatedIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[ingredientName]
  };
  return updatedState;
};

const addIngredient = (state, action) => {
  return updateObject(state, addOrRemoveIngredient(state, action.ingredientName, "add"));
};

const removeIngredient = (state, action) => {
  return updateObject(state, addOrRemoveIngredient(state, action.ingredientName, "remove"));
};

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: {
      salad: action.ingredients.salad,
      bacon: action.ingredients.bacon,
      cheese: action.ingredients.cheese,
      meat: action.ingredients.meat
    },
    totalPrice: initialState.totalPrice,
    error: false,
    loading: true
  });
};

const fetchIngredientsFailed = (state, action) => {
  return updateObject(state, {error: true, loading: false});
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
    default: return state;
  }
};

export default reducer;

