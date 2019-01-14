import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';

import { PropsBatteryManufacturerFormWrap } from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerForm/@types/BatteryManufacturer.h';

const BatteryManufacturerFrom = React.lazy(() => (
  import(/* webpackChunkName: "battery_manufacturer_form" */'components/directories/autobase/battery_manufacturer/BatteryManufacturerForm/BatteryManufacturerForm')
));

class BatteryManufacturerFormWrap extends React.Component<PropsBatteryManufacturerFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}battery-brand-form`;

    return showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <BatteryManufacturerFrom
            element={props.element}
            handleHide={props.onFormHide}

            page={page}
            path={path}
          />
        </React.Suspense>
      )
      :
      (
        <DivNone />
      );
  }
}

export default BatteryManufacturerFormWrap;
