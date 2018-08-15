import * as React from 'react';

const WithLifeCycle: any = lyfeCycleMethods => Component =>
    class WithLifeCycle extends React.Component<any, any> {
      componentDidMount() {
        try {
          lyfeCycleMethods.componentDidMount(this.props);
        } catch (e) {
          console.log(e);
        }
      }

      componentWillUnmount() {
        try {
          lyfeCycleMethods.componentWillUnmount(this.props);
        } catch (e) {
          console.log(e);
        }
      }

      componentWillReceiveProps(props) {
        try {
          lyfeCycleMethods.componentWillReceiveProps(this.props);
        } catch (e) {
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
    }

export default WithLifeCycle;
