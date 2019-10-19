import React, { useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from '../src/hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

const app = (props) => {

  useEffect(() => {
    props.onTryAutoSingin();
  }, []);

  let route = (
    <Switch>
      <Route path='/' exact component={BurgerBuilder}/>
      <Route path='/auth' component={asyncAuth}/>
      <Redirect to='/' />
    </Switch>
  );
  if (props.isAuthenticated) {
    route = (
      <Switch>
        <Route path='/' exact component={BurgerBuilder}/>
        <Route path='/checkout' component={asyncCheckout}/>
        <Route path='/auth' component={asyncAuth}/>
        <Route path='/logout' component={Logout}/>
        <Route path='/orders' component={asyncOrders}/>
        <Redirect to='/' />
      </Switch>
    );
  }
  return (
    <div>
      <Layout>
        {route}
      </Layout>
    </div>
  );  
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSingin: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
