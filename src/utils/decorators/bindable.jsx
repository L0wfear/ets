import * as React from 'react';
import * as PropTypes from 'prop-types';

export default function bindable(ComposedComponent) {
  return class BindableComponent extends React.Component {
    constructor() {
      super();

      this.onClick = this.onClick.bind(this);
      this.onChange = this.onChange.bind(this);
    }

    static get propTypes() {
      return {
        onClick: PropTypes.func,
        onChange: PropTypes.func,
        bindOnClick: PropTypes.any,
        bindOnChange: PropTypes.any,
      };
    }

    onClick(...args) {
      if (typeof this.props.onClick === 'function') {
        const { bindOnClick } = this.props;
        const boundValues = !Array.isArray(bindOnClick) ? [bindOnClick] : bindOnClick;
        this.props.onClick(...boundValues, ...args);
      }
    }

    onChange(...args) {
      if (typeof this.props.onChange === 'function') {
        const { bindOnChange } = this.props;
        const boundValues = !Array.isArray(bindOnChange) ? [bindOnChange] : bindOnChange;
        this.props.onChange(...boundValues, ...args);
      }
    }

    render() {
      return <ComposedComponent {...this.props} onClick={this.onClick} onChange={this.onChange} />;
    }
  };
}
