import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

const orders = (props) => {
  const {onFetchOrders} = props;
  useEffect(() => {
    onFetchOrders(props.token, props.localId);
  }, [onFetchOrders]);

  let orders = props.loading ? <Spinner /> : 
    props.orders.map(order => (
      <Order 
        key={order.id}
        ingredients={order.ingredients}
        price={+order.price}/>
    ));
  return(
    <div>
      {orders}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    localId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, localId) => dispatch(actions.fetchOrders(token, localId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(orders, axios));
