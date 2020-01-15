import * as React from 'react';
import { BlockCarInfoProps } from '../../../@types/BlockCarInfo';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { get } from 'lodash';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';
import { fadeInAnimation } from 'global-styled/global-animation';

const FieldCarsConditionsCarSelectFactStatusWrapper = styled(EtsBootstrap.Row)`
  animation: ${fadeInAnimation} .3s ease-in;
`;

type FieldCarsConditionsCarSelectFactStatusProps = (
  {
    isPermitted: boolean;
  }
) & Pick<BlockCarInfoProps, 'formState' | 'formErrors' | 'handleChange'>;

const FieldCarsConditionsCarSelectFactStatus: React.FC<FieldCarsConditionsCarSelectFactStatusProps> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
    } = props;

    const handleChangeData = React.useCallback(
      (key, event) => {
        props.handleChange({
          data: {
            ...state.data,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [state.data, props.handleChange],
    );

    const handleChangeDataBoolean = React.useCallback(
      (key, event) => {
        handleChangeData(key, get(event, 'target.checked', false));
      },
      [handleChangeData],
    );

    return (
      <FieldCarsConditionsCarSelectFactStatusWrapper>
        {
          state.fact_status === 'on_line'
            && (
              <React.Fragment>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="waybill_number"
                    type="number"
                    label="Выдан ПЛ номер:"
                    value={state.data.waybill_number}
                    error={errors.data.waybill_number}
                    disabled
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="mission_numbers"
                    type="string"
                    label="Активное задание:"
                    value={state.data.mission_numbers}
                    error={errors.data.mission_numbers}
                    disabled
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    id="data-not_passed_verification_glonass"
                    type="boolean"
                    label="Не пройдена проверка фактической работы техники с использованием ГЛОНАСС"
                    value={state.data.not_passed_verification_glonass}
                    error={errors.data.not_passed_verification_glonass}
                    onChange={handleChangeDataBoolean}
                    boundKeys="not_passed_verification_glonass"
                    className="checkbox-input flex-reverse"
                    disabled={!props.isPermitted}
                  />
                </EtsBootstrap.Col>
              </React.Fragment>
            )
        }
      </FieldCarsConditionsCarSelectFactStatusWrapper>
    );
  },
);

export default FieldCarsConditionsCarSelectFactStatus;
