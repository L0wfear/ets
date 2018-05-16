import * as React from 'react';

const WithLifeCycle: any = lyfeCycleMethods => Component =>
    class WithLifeCycle extends React.Component<any, any> {
      componentDidMount() {
        try {
          lyfeCycleMethods.componentDidMount(this.props);
        } catch (e) {
          //
        }
      }

      componentWillUnmount() {
        try {
          lyfeCycleMethods.componentWillUnmount(this.props);
        } catch (e) {
          //
        }
      }

      componentWillReceiveProps(props) {
        try {
          lyfeCycleMethods.componentWillReceiveProps(this.props);
        } catch (e) {
          //
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
