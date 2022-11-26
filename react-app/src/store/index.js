import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import { groupsReducer } from './groups';
import { expenseReducer } from './expenses';
import { paymentsReducer } from './payments';
import { currGroupMembersReducer } from './currentGroupMembers';
import { currExpenseReducer } from './currentExpense';

const rootReducer = combineReducers({
  session,
  groups: groupsReducer,
  expenses: expenseReducer,
  payments: paymentsReducer,
  currGroupMembers: currGroupMembersReducer,
  currExpense: currExpenseReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
