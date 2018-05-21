import * as React from 'react';

const withClassMethods = (methodObjects = {}) => Component =>
  class WithClassMethods extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = {};
      Object.entries(methodObjects).forEach(([methodName, action]) => this.state[methodName] = (...arg) => action(props)(...arg));
    }

    render() {
      return (
        <Component
          {
            ...this.props,
          }
          {
            ...this.state,
          }
        />
      );
    }
  }

export default withClassMethods;
