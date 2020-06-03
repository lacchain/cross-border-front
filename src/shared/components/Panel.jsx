/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Collapse,
} from 'reactstrap';
import PropTypes from 'prop-types';
import LoadingIcon from 'mdi-react/LoadingIcon';
import CloudOff from 'mdi-react/CloudOffOutlineIcon';

export default class AlertComponent extends PureComponent {
  static propTypes = {
    divider: PropTypes.bool,
    color: PropTypes.string,
    title: PropTypes.string,
    subhead: PropTypes.string,
    label: PropTypes.string,
    actions: PropTypes.object,
    cloud: PropTypes.bool,
    events: PropTypes.bool,
    icon: PropTypes.string,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
    sm: PropTypes.number,
    xs: PropTypes.number,
    before: PropTypes.element,
    panelClass: PropTypes.string,
    bond: PropTypes.object
  };

  static defaultProps = {
    divider: false,
    color: '',
    title: '',
    subhead: '',
    label: '',
    actions: false,
    cloud: false,
    events: false,
    icon: '',
    md: 0,
    lg: 0,
    xl: 0,
    sm: 0,
    xs: 0,
    before: null,
    panelClass: '',
    brochureUrl: '',
    bond: {}
  };

  constructor() {
    super();

    this.state = {
      visible: true,
      collapse: true,
      refresh: false,
    };

  }

  onShow = () => {
    this.setState({ visible: true });
  };

  onDismiss = () => {
    this.setState({ visible: false });
  };

  onCollapse = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  onRefresh = () => {
    // your async logic here
    this.setState(prevState => ({ refresh: !prevState.refresh }));
    setTimeout(() => this.setState({ refresh: false }), 5000);
  };

  render() {
    const {
      md, lg, xl, sm, xs, color, divider, icon, title, label, actions, cloud, subhead, before,
      panelClass, children,
    } = this.props;

    const { collapse, refresh, visible } = this.state;

    if (visible) {
      return (
        <Col md={ md } lg={ lg } xl={ xl } sm={ sm } xs={ xs }>
          <Card
            className={ `panel${color ? ` panel--${color}` : ''}
            ${divider ? ' panel--divider' : ''}${collapse ? '' : ' panel--collapse'} ${panelClass}` }
          >
            <CardBody className="panel__body">
              {refresh ? <div className="panel__refresh"><LoadingIcon /></div> : ''}
              {/* {events && <div className="panel__btns">
                <Button size="sm" outline>See all</Button>
              </div>} */}

              {actions && <div className="panel__btns">
                {actions}
              </div>}
              <div className="panel__title">
                <h5 className={ `bold-text ${!cloud ? '' : 'light' }` }>
                  {icon ? <span className={ `panel__icon lnr lnr-${icon}` } /> : ''}
                  {title}
                  {cloud && <CloudOff  size= { 14 } className="icon" />}
                  <div style={ { marginLeft: 10, textTransform: 'capitalize' } } className={ `badge badge-${label}` }>{label}</div>
                </h5>
                <h5 className="bold-text-gray">{subhead}</h5>
              </div>
              <Collapse isOpen={ collapse }>
                <div className="panel__content">
                  {children}
                </div>
              </Collapse>
            </CardBody>
          </Card>
          {before}
        </Col>
      );
    }

    return '';
  }
}

export const PanelTitle = ({ title }) => (
  <div className="panel__title">
    <h5 className="bold-text">
      {title}
    </h5>
  </div>
);
