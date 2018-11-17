import * as React from 'react';

/**
 * @deprecated
 */
const WithLifeCycle: any = (lyfeCycleMethods) => (Component) =>
  class extends React.Component<any, any> {
    componentDidMount() {
      try {
        lyfeCycleMethods.componentDidMount(this.props);
      } catch (e) {
        // tslint:disable-next-line
        console.log(e);
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state }
        />
      );
    }
  };

export default WithLifeCycle;
