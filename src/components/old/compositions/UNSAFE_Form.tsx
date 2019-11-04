import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FluxContext } from 'utils/decorators';

/**
 * Форма
 * @abstract
 */
@FluxContext
class Form<P extends any, S extends any> extends React.Component<P, S> {
  static get propTypes() {
    return {
      handleFormChange: PropTypes.func.isRequired,
      handleMultipleChange: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
      formState: PropTypes.object.isRequired,
    };
  }

  static defaultProps() {
    return {
      handleMultipleChange: (v) => v,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      /* inital state */
    } as any;
  }

  handleChange = (field, e) => this.props.handleFormChange(field, e);

  handleMultipleChange = (fields) => this.props.handleMultipleChange(fields);

  handleSubmit = (...props) => this.props.onSubmit(...props);

  render() {
    return <div>UNSAFE_Form Component</div>;
  }
}

export default Form;
