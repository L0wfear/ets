import * as React from 'react';

const WithContext = contextObj => Component =>
  class WithContext extends React.Component<any, any> {
    context!: ETSCore.LegacyContext;

    static get contextTypes() {
      return {
        ...contextObj,
      };
    }

    render() {
      return (
        <Component
          { ...this.props }
          { ...this.context }
        />
      )
    }
  }

export default WithContext;
