import * as React from 'react';

const withClassMethods = (methodObjects = {}) => Component =>
  class WithClassMethods extends React.Component<any, any> {
    constructor(props) {
      super(props);

      Object.entries(methodObjects).forEach(([methodName, action]) => this[methodName] = (...arg) => action(props)(...arg));
    }

    render() {
      return (
        <Component
          {
            ...this.props,
            ...Object.keys(methodObjects).reduce((newObj, key) => ({ ...newObj, [key]: this[key ] }), { withClassMethods: true }),
          }
        />
      );
    }
  }

export default withClassMethods;
