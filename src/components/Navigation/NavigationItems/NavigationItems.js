import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/" exact clicked={props.clicked}>Burger Builder</NavigationItem>
    <NavigationItem link="/orders" clicked={props.clicked}>Orders</NavigationItem>
    { props.isAuthenticated ? 
      <NavigationItem link="/logout" clicked={props.clicked}>Logout</NavigationItem> : 
      <NavigationItem link="/auth" clicked={props.clicked}>Login</NavigationItem>
    }
  </ul>
);

export default navigationItems;
