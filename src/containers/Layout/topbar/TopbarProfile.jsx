import React, { PureComponent } from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';
import { userService } from '../../../services/userService';
import { authService } from '../../../services/authService';

const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

class TopbarProfile extends PureComponent {
  constructor() {
    super();
    this.state = {
      collapse: false,
      username: null,
      modal: false,
    };
  }
  componentDidMount() {
    const user = userService.getUser();
    if (user) {
      this.setState({
        username: user
      });
    }
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  close = () => {
    this.setState({ modal: false });
  }

  LogOut = (e) => {
    authService.logout();
  };

  render() {
    const { collapse } = this.state;

    return (
      <div className="topbar__profile">
        <button type="button" className="topbar__avatar" onClick={ this.toggle }>
          <img className="topbar__avatar-img" src={ Ava } alt="avatar" />
          <p className="topbar__avatar-name">{this.state.username}</p>
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && <button type="button" className="topbar__back" onClick={ this.toggle } />}
        <Collapse isOpen={ collapse } className="topbar__menu-wrap">
          <div className="topbar__menu">
            {/*<TopbarMenuLink title="My profile" icon="user" path="/pages/account" />*/}
            {/*<div className="topbar__menu-divider" />*/}
            <TopbarMenuLink title="Log Out" icon="exit" path="/log_in" onClick={ this.LogOut } />
          </div>
        </Collapse>
      </div>
    );
  }
}

export default TopbarProfile;
