import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Topbar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';

class Layout extends Component {
  state = {
    sidebarShow: false,
    sidebarCollapse: false,
  };

  changeSidebarVisibility = () => {
    this.setState(prevState => ({ sidebarCollapse: !prevState.sidebarCollapse }));
  };

  changeMobileSidebarVisibility = () => {
    this.setState(prevState => ({ sidebarShow: !prevState.sidebarShow }));
  };

  render() {
    const { sidebarShow, sidebarCollapse } = this.state;
    const layoutClass = classNames({
      layout: true,
      'layout--collapse': sidebarCollapse,
    });

    return (
      <div className={ layoutClass }>
        <Topbar
          changeMobileSidebarVisibility={ this.changeMobileSidebarVisibility }
          changeSidebarVisibility={ this.changeSidebarVisibility }
        />
        <Sidebar
          sidebarShow={ sidebarShow }
          sidebarCollapse={ sidebarCollapse }
          changeMobileSidebarVisibility={ this.changeMobileSidebarVisibility }
        />
      </div>
    );
  }
}

export default withRouter(Layout);
