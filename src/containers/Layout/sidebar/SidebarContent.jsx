import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import { authService } from '../../../services/authService';
import { userService } from '../../../services/userService';

class SidebarContent extends Component {
  constructor() {
    super();
    this.state = {
      modal: false,
    };
  }

  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  close = () => {
    this.setState({ modal: false });
  }

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  hideSidebarAndLogOut = (e) => {
    authService.logout();
    const { onClick } = this.props;
    onClick();
  };

  render() {
    return (
      <div className="sidebar__content">
        {userService.isCiti() ? 
        <ul className="sidebar__block">
          <SidebarLink title="Accounts" route="/pages/accounts" icon="license" onClick={this.hideSidebar} />
          <SidebarLink title="Movements" route="/pages/movements" icon="license" onClick={this.hideSidebar} />
        </ul> :
        <ul className="sidebar__block">
          <SidebarLink title="Dashboard" route={`/pages/accounts/${localStorage.getItem('userDltAddress')}/details`} icon="license" onClick={this.hideSidebar} />
        </ul>
        }
        <ul className="sidebar__block">
          <SidebarLink title="Log Out" icon="exit" onClick={this.hideSidebarAndLogOut} />
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
