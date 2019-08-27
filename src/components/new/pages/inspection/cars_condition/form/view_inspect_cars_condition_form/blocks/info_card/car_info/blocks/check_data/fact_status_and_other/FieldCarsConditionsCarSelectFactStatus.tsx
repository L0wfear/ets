import * as React from 'react';
import { BlockCarInfoProps } from '../../../@types/BlockCarInfo';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import { get } from 'lodash';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const FieldCarsConditionsCarSelectFactStatusWrapper = styled(EtsBootstrap.Row)`
  animation: ${fadeIn} .3s ease-in;
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
      isPermitted,
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
            ? (
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
            : (
              state.fact_status === 'repair'
                ? (
                  <EtsBootstrap.Col md={6}>
                    <ExtField
                      id="reason_repair"
                      type="string"
                      label="Причина ремонта:"
                      value={state.data.reason_repair}
                      error={errors.data.reason_repair}
                      disabled={!isPermitted}
                      onChange={handleChangeData}
                      boundKeys="reason_repair"
                    />
                  </EtsBootstrap.Col>
                )
                : (
                  <DivNone />
                )
            )
        }
      </FieldCarsConditionsCarSelectFactStatusWrapper>
    );
  },
);

export default FieldCarsConditionsCarSelectFactStatus;
