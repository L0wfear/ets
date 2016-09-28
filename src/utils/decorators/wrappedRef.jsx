import React, { PropTypes } from 'react';

export default function wrappedRef(ComposedComponent) {
  return class WrappedRefComponent extends React.Component {

    static get propTypes() {
      return {
        wrappedRef: PropTypes.func,
      };
    }

    render() {
      return (
        <div ref={this.props.wrappedRef}>
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  };
}
