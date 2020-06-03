import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BasicNotification } from '../../shared/components/BasicNotification';
import NotificationSystem from 'rc-notification';
import notificationsActions from '../../features/notification/duck/actions';

class NotificationManager extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = null;
  }

  componentDidMount = () => {
    NotificationSystem.newInstance({}, n => this.notificationSystem = n);
    this.props.deleteSuccess();
    this.props.deleteError();
  }

  componentDidUpdate = async () => {
    this.setSuccess();
    this.setError();
  };

  showNotification = ({ content, position }) => {
    this.notificationSystem.notice({
      content: content,
      duration: 50,
      closable: true,
      style: { top: 0, left: 'calc(100vw - 100%)' },
      className: position,
    });
  };

  setSuccess = () => {
    if (!this.props.success.title) {
      return;
    }

    this.props.deleteSuccess();

    const { title, message } = this.props.success;

    return this.showNotification({
      content: <BasicNotification
        color={ 'success' }
        title={ title }
        message={ message }
               />,
      position: 'right-up',
    });
  };

  setError = () => {
    if (!this.props.error.title) {
      return;
    }

    this.props.deleteError();

    const { title, message } = this.props.error;

    return this.showNotification({
      content: <BasicNotification
        color={ 'danger' }
        title={ title }
        message={ message }
               />,
      position: 'right-up',
    });
  };

  render() {
    return (<div></div>);
  }
}

const mapStateToProps = state => ({
  success: state.notification.success,
  error: state.notification.error,
});

const mapDispatchToProps = {
  deleteSuccess: notificationsActions.deleteSuccessNotification,
  deleteError: notificationsActions.deleteErrorNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationManager);
