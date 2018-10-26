import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

const ReactTest: any = React;

const WaybillForm = ReactTest.lazy(() => (
  import(/* webpackChunkName: "waybill_form" */'components/waybill/WaybillForm')
));

class WaybillFormLazy extends React.PureComponent<any, {}> {
  render() {
    return (
      this.props.show ?
      (
        <ReactTest.Suspense fallback={<LoadingComponent />}>
          <WaybillForm
            {...this.props}
          />
        </ReactTest.Suspense>
      )
      :
      ( <DivNone /> )
    )
  }
}

export default WaybillFormLazy;
