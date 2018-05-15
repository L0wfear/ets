import * as React from 'react';
import { FluxContext } from 'utils/decorators';

const WithLifeCycle: any = lyfeCycleMethods => Component =>
  FluxContext(
    class WithLifeCycle extends React.Component<any, any> {
      componentDidMount() {
        try {
          lyfeCycleMethods.componentDidMount({
            ...this.props,
            flux: this.context.flux,
          })
        } catch (e) {
          //
        }
      }

      componentWillUnmount() {
        try {
          lyfeCycleMethods.componentWillUnmount({
            ...this.props,
            flux: this.context.flux,
          })
        } catch (e) {
          //
        }
      }

      componentWillReceiveProps(props) {
        try {
          lyfeCycleMethods.componentWillUnmount({
            ...this.props,
            flux: this.context.flux,
          })
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
  );

export default WithLifeCycle;
