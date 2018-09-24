import * as React from 'react';
import * as PropTypes from 'prop-types';

export default function wrappedRef(ComposedComponent) {
  return class WrappedRefComponent extends React.Component {
    static get propTypes() {
      return {
        wrappedRef: PropTypes.func,
      };
    }

    render() {
      const { wrappedRef: wrappedRefOuter, ...props } = this.props;

      return (
        <div ref={wrappedRefOuter}>
          <ComposedComponent {...props} />
        </div>
      );
    }
  };
}
