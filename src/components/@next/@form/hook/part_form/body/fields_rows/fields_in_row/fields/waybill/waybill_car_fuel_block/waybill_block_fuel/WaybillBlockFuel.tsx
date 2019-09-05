import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import WaybillFuelType from './00-fuel_type/WaybillFuelType';
import WaybillFuelStart from './01-fuel_start/WaybillFuelStart';
import WaybillFuelGiven from './02-fuel_given/WaybillFuelGiven';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import WaybillFuelEnd from './03-fuel_end/WaybillFuelEnd';
import WaybillFactFuelEnd from './04-fact_fuel_end/WaybillFactFuelEnd';

type WaybillBlockFuelProps = {
  formDataKey: string;
  md?: number;
};

const WaybillBlockFuel: React.FC<WaybillBlockFuelProps> = React.memo(
  (props) => {
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
          <h4>Топливо</h4>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <EtsBootstrap.Row>
                <WaybillFuelType formDataKey={props.formDataKey} md={12} />
                <WaybillFuelStart formDataKey={props.formDataKey} md={12} />
                <WaybillFuelGiven formDataKey={props.formDataKey} md={12} />
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <EtsBootstrap.Row>
                {
                  IS_CLOSE_OR_IS_ACTIVE && (
                    <React.Fragment>
                      <WaybillFuelEnd formDataKey={props.formDataKey} md={12} />
                      <WaybillFactFuelEnd formDataKey={props.formDataKey} md={12} />
                    </React.Fragment>
                  )
                }
              </EtsBootstrap.Row>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
      ),
      [
        props,
        IS_CLOSE_OR_IS_ACTIVE,
      ],
    );
  },
);

export default WaybillBlockFuel;
