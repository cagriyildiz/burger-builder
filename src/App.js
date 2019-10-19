import React, { useEffect, Suspense } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

const app = (props) => {

  useEffect(() => {
    props.onTryAutoSingin();
  }, []);

  let route = (
    <Switch>
      <Route path='/' exact component={BurgerBuilder}/>
      <Route path='/auth' render={() => <Auth />}/>
      <Redirect to='/' />
    </Switch>
  );
  if (props.isAuthenticated) {
    route = (
      <Switch>
        <Route path='/' exact component={BurgerBuilder}/>
        <Route path='/checkout' render={() => <Checkout />}/>
        <Route path='/auth' render={() => <Auth />}/>
        <Route path='/logout' component={Logout}/>
        <Route path='/orders' render={() => <Orders />}/>
        <Redirect to='/' />
      </Switch>
    );
  }
  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>{route}</Suspense>
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
