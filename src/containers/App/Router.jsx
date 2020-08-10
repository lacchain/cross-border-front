import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';
import LogIn from '../LogIn/index';
import SignUp from '../SignUp/index';
import Accounts from '../Accounts/index';
import { userService } from '../../services/userService';
import NotFound404 from '../DefaultPage/404/index';
import AccountDetails from '../AccountDetails/index';
import NewTransfer from '../NewTransfer/index';
import Movements from '../Movements/index';
import MovementDetails from '../MovementDetails/index';
import ResetPassword from '../ResetPassword/index';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route { ...rest } render={ props => (
    localStorage.getItem('user')
      ? <Component { ...props } />
      : <Redirect to={ { pathname: '/', state: { from: props.location } } } />
  ) }
  />
);

const Pages = () => (
  <Switch>
    <PrivateRoute path="/pages/accounts/:accountId/details" component={ AccountDetails } />
    <PrivateRoute path="/pages/movements/:movementId/details" component={ MovementDetails } />
    <PrivateRoute path="/pages/new-transfer" component={ NewTransfer } />
    {userService.isCiti() ? <PrivateRoute path="/pages/accounts" component={ Accounts } /> : <PrivateRoute path={`/pages/accounts/${localStorage.getItem('userDltAddress')}/details`} component={ AccountDetails } />}
    {userService.isCiti() ? <PrivateRoute path="/pages/movements" component={ Movements } /> : <PrivateRoute path={`/pages/accounts/${localStorage.getItem('userDltAddress')}/details`} component={ AccountDetails } />}
  </Switch>
);

const wrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <PrivateRoute path="/pages" component={ Pages } />
    </div>
  </div>
);

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/" component={ LogIn } />
        <Route exact path="/sign-up" component={ SignUp } />
        <Route path="/reset-password/:token" component={ ResetPassword } />
        <Route path="/404" component={ NotFound404 } />
        <Route exact path="/log_in" component={ LogIn } />
        <Route path="/" component={ wrappedRoutes } />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
