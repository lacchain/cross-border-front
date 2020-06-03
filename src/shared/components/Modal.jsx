import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import classNames from 'classnames';

export default class ModalComponent extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    color: PropTypes.string.isRequired,
    colored: PropTypes.bool,
    header: PropTypes.bool,
    modal: PropTypes.bool,
    toggle: PropTypes.func,
    centered: PropTypes.bool
  };

  static defaultProps = {
    title: '',
    message: '',
    colored: false,
    header: false,
    modal: false,
    centered: false
  };

  render() {
    const {
      color, title, message, colored, header, modal, toggle, centered
    } = this.props;
    let Icon;

    switch (color) {
      case 'primary':
        Icon = <span className="lnr lnr-pushpin modal__title-icon" />;
        break;
      case 'success':
        Icon = <span className="lnr lnr-thumbs-up modal__title-icon" />;
        break;
      case 'warning':
        Icon = <span className="lnr lnr-flag modal__title-icon" />;
        break;
      case 'danger':
        Icon = <span className="lnr lnr-cross-circle modal__title-icon" />;
        break;
      default:
        break;
    }
    const modalClass = classNames({
      'modal-dialog--colored': colored,
      'modal-dialog--header': header,
    });

    return (
      <div>
        <Modal
          isOpen={ modal }
          toggle={ toggle }
          className={ `modal-dialog--${color} ${modalClass}` }
          centered={ centered }
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={ toggle } />
            {header ? '' : Icon}
            <h4 className="bold-text  modal__title">{title}</h4>
          </div>
          <div className="modal__body">
            {message}
          </div>
          <ButtonToolbar className="modal__footer">
            <Button outline={ colored } color={ color } onClick={ toggle }>Ok</Button>
          </ButtonToolbar>
        </Modal>
      </div>
    );
  }
}
