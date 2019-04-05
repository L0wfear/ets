import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { MarginTopRow } from './styled';
import { get } from 'lodash';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../@types/CarForm';
import { Col, Row } from 'react-bootstrap';
import { CarPassporntData } from 'redux-main/reducers/modules/autobase/car/@types';
import { DivNone } from 'global-styled/global-styled';
import GtnSelectFields from './by_type/gtn/GtnSelectFields';
import GibddSelectFields from './by_type/gibdd/GibddSelectFields';

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
      (key: keyof CarPassporntData, value) => {
        props.onChange({
          passport_data: {
            ...passport_data,
            [key]: get(value, 'target.value', value),
          },
        });
      },
      [passport_data],
    );

    const onChangePassportType = React.useCallback(
      (type) => {
        onChange('type', type);
      },
      [onChange],
    );

    return (
      <>
        <MarginTopRow>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <ExtField
                  id="GIBDD"
                  type="boolean"
                  label="ГИБДД "
                  value={passport_data.type === 'GIBDD'}
                  emptyValue={null}
                  onChange={onChangePassportType}
                  boundKeys="GIBDD"
                  disabled={!props.isPermitted}
                />
              </Col>
              <Col md={6}>
                <ExtField
                  id="GTN"
                  type="boolean"
                  label="ГТН (Гостехнадзор) "
                  value={passport_data.type === 'GTN'}
                  emptyValue={null}
                  onChange={onChangePassportType}
                  boundKeys="GTN"
                  disabled={!props.isPermitted}
                />
              </Col>
            </Row>
          </Col>
          <Col md={12}>
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
          </Col>
        </MarginTopRow>
      </>
    );
  },
);

export default PassportInfoTab;
