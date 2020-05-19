import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { MarginTopRow } from './styled';
import { get } from 'lodash';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../@types/CarForm';

import { DivNone } from 'global-styled/global-styled';
import GtnSelectFields from './by_type/gtn/GtnSelectFields';
import GibddSelectFields from './by_type/gibdd/GibddSelectFields';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { isArray, isObject, isNullOrUndefined, isString } from 'util';
import { getDefaultCar } from '../../../utils';

const passportByKey = {
  GIBDD: 'ГИБДД',
  GTN: 'ГТН',
};

type PassportInfoTabProps = {
  isPermitted: boolean;
  formState: CarWrap;
  formErrors: any;
  onChange: FormWithHandleChange<CarWrap>;
  onChangeBoolean: FormWithHandleChangeBoolean<CarWrap>;
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  page: string;
  path: string;
};

const PassportInfoTab: React.FC<PassportInfoTabProps> = React.memo(
  (props) => {
    const {
      isPermitted,
      formState: state,
      formErrors: {
        passport_data: errors,
      },
    } = props;

    const {
      passport_data,
    } = state;

    const onChange = React.useCallback(
      (key: any, value?: any) => {
        if (isObject(key)) {
          props.onChange({
            passport_data: {
              ...passport_data,
              ...key,
            },
          });
        } else {
          props.onChange({
            passport_data: {
              ...passport_data,
              [key]: get(value, 'target.value', value),
            },
          });
        }
      },
      [passport_data],
    );

    const onChangePassportType = React.useCallback(
      async (type) => {
        if (!passport_data.type || passport_data.type !== type) {
          let changeObj: Partial<CarWrap['passport_data']> = {
            type,
            vin: state.vin || '',
          };

          if (passport_data.type && passport_data.type !== type) {
            const hasInputData = Object.entries(passport_data).some(
              ([key, value]: [any, any]) => {
                if (key === 'disabled' || key === 'car_id' || key === 'type' || key === 'number' || key === 'seria_number') {
                  return false;
                }
                if (key === 'files') {
                  return isArray(value) && value.length > 0;
                }

                return isString(value) ? value !== '' : !isNullOrUndefined(value);
              },
            );

            if (hasInputData) {
              try {
                await global.confirmDialog({
                  title: 'Смена типа паспорта',
                  body: `Будут очищены поля, которые относятся к паспорту ${passportByKey[passport_data.type]}. Продолжить?`,
                });

                const { car_id, id, ...defaultPassportData } = getDefaultCar().passport_data; // что бы при смене не сбрасывался car_id
                changeObj = {
                  ...defaultPassportData,
                  ...changeObj,
                };
              } catch (e) {
                return;
              }
            }
          }

          if (type === 'GIBDD') {
            changeObj.seria_number = passport_data.number;
          }
          if (type === 'GTN') {
            changeObj.number = passport_data.seria_number;
          }

          onChange(changeObj);
        }
      },
      [onChange, passport_data, state.vin],
    );

    return (
      <>
        <MarginTopRow>
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  id="GIBDD"
                  type="boolean"
                  label={`Паспорт (${passportByKey.GIBDD})`}
                  value={passport_data.type === 'GIBDD'}
                  emptyValue={null}
                  onChange={onChangePassportType}
                  boundKeys="GIBDD"
                  disabled={!props.isPermitted}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  id="GTN"
                  type="boolean"
                  label={`Паспорт (${passportByKey.GTN})`}
                  value={passport_data.type === 'GTN'}
                  emptyValue={null}
                  onChange={onChangePassportType}
                  boundKeys="GTN"
                  disabled={!props.isPermitted}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            {
              passport_data.type === 'GIBDD'
                ? (
                  <GibddSelectFields
                    isPermitted={isPermitted}
                    onChange={onChange}
                    passport_data_errors={errors}
                    passport_data={passport_data}

                    page={props.page}
                    path={props.path}
                  />
                )
                : (
                  <DivNone />
                )
            }
            {
              passport_data.type === 'GTN'
                ? (
                  <GtnSelectFields
                    isPermitted={isPermitted}
                    onChange={onChange}
                    passport_data_errors={errors}
                    passport_data={passport_data}

                    page={props.page}
                    path={props.path}
                  />
                )
                : (
                  <DivNone />
                )
            }
          </EtsBootstrap.Col>
        </MarginTopRow>
      </>
    );
  },
);

export default PassportInfoTab;
