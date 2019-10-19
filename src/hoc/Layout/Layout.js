import React, { useState } from 'react';
import { connect } from 'react-redux';

import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const layout = (props) => {
  const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

  const siderDrawerClosedHandler = () => {
    setSideDrawerIsVisible(false);
  };

  const sideDrawerToggleHandler = () => {
    setSideDrawerIsVisible(!sideDrawerIsVisible);
  };
  
  return (
    <Aux>
    <Toolbar 
      isAuthenticated={props.isAuthenticated}
      drawerToggleClicked={sideDrawerToggleHandler}/>
    <SideDrawer
      isAuthenticated={props.isAuthenticated}
      open={sideDrawerIsVisible} 
      closed={siderDrawerClosedHandler}/>
    <main className={classes.Content}>
      {props.children}
    </main>
  </Aux>
  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token != null
  };
};

export default connect(mapStateToProps)(layout);
