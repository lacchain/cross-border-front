import React from 'react';
import MaskedInput from 'react-text-mask';

export default ({
  input, placeholder, type, disabled, mask, style, meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
    {mask && <MaskedInput
      { ...input }
      guide={ false }
      placeholder={ placeholder }
      type={ type }
      disabled={ disabled }
      mask={ mask }
      style={ style }
             />}

    {!mask && <input { ...input } placeholder={ placeholder } type={ type } disabled={ disabled }/>}

    {touched && error && <span className="form__form-group-error">{error}</span>}
  </div>
  );
