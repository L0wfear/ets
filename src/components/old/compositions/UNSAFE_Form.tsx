import * as React from 'react';

import { FluxContext } from 'utils/decorators';

/**
 * Форма
 * @abstract
 */
@FluxContext
class Form<P extends any, S extends any> extends React.Component<P, S> {
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
