import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { BorderDash } from 'global-styled/global-styled';
import WaybillBlockIndicator from './waybill_block_indicator/WaybillBlockIndicator';
import WaybillBlockFuel from './waybill_block_fuel/WaybillBlockFuel';
import WaybillBlockCarRefill from './waybill_block_car_refill/WaybillBlockCarRefill';

type WaybillCarFuelBlockProps = {
  formDataKey: string;
  md?: number;
};

const WaybillCarFuelBlock: React.FC<WaybillCarFuelBlockProps> = React.memo(
  (props) => {
    const {
      car_id,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const isSelectedCarId = Boolean(car_id);

    return isSelectedCarId && (
      <EtsBootstrap.Col md={props.md || 12}>
        <React.Fragment>
          <h3>Транспортное средство</h3>
          <BorderDash width={2} borderStyle="dashed" color="rgba(0, 0, 0, 0.5)">
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <WaybillBlockIndicator formDataKey={props.formDataKey} md={4} />
                <WaybillBlockFuel formDataKey={props.formDataKey} md={8} />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={12}>
                <WaybillBlockCarRefill formDataKey={props.formDataKey} md={12} />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </BorderDash>
        </React.Fragment>
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillCarFuelBlock;
