import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class renderDatePickerField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.bool,
    }),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    placeholder: ''
  }

  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (date) {
    this.props.input.onChange(moment(date).format('YYYY-MM-DD'));
  }

  render () {
    const {
      input, placeholder, disabled,
      meta: {touched, error}
    } = this.props;

    return (
      <div className="date-picker">
        <DatePicker
          placeholder={ placeholder }
          dateFormat="YYYY-MM-dd"
          selected={ input.value ? moment(input.value).valueOf() : null }
          onChange={ this.handleChange }
          autoComplete="off"
          disabled = { disabled }
        />
        {touched && error && <span className="form__form-group-error">{error}</span>}
      </div>
    );
  }
}

export default renderDatePickerField;
