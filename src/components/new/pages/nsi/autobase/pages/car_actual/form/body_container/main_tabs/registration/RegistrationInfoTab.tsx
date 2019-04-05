import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { CenterCol, MarginTopRow } from './styled';
import { get } from 'lodash';
import config from 'config';
import { DivNone } from 'global-styled/global-styled';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../@types/CarForm';
import { Col } from 'react-bootstrap';

type RegistrationInfoTabProps = {
  isPermitted: boolean;
  formState: CarWrap;
  formErrors: any;
  onChange: FormWithHandleChange<CarWrap>;
  onChangeBoolean: FormWithHandleChangeBoolean<CarWrap>;
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  page: string;
  path: string;
};

const textAreaStyleNote = { resize: 'none' };

const RegistrationInfoTab: React.FC<RegistrationInfoTabProps> = React.memo(
  (props) => {
    const {
      isPermitted,
      formState: state,
      formErrors: {
        registration_data: errors,
      },
    } = props;

    const {
      registration_data,
    } = state;

    const onChange = React.useCallback(
      (key, value) => {
        props.onChange({
          registration_data: {
            ...registration_data,
            [key]: get(value, 'target.value', value),
          },
        });
      },
      [registration_data],
    );

    return (
      <>
        <MarginTopRow>
          <Col md={6}>
            <ExtField
              type="string"
              label="Номер свидетельства о регистрации"
              value={registration_data.certificate_number}
              onChange={onChange}
              boundKeys="certificate_number"
              disabled={!isPermitted || registration_data.disabled}
            />
            <ExtField
              type="string"
              label="Кем выдано свидетельство о регистрации"
              value={registration_data.given_by}
              onChange={onChange}
              boundKeys="given_by"
              disabled={!isPermitted || registration_data.disabled}
              error={errors.given_by}
            />
            <ExtField
              type="date"
              time={false}
              label="Дата регистрации"
              date={registration_data.given_at}
              onChange={onChange}
              boundKeys="given_at"
              disabled={!isPermitted || registration_data.disabled}
              makeGoodFormat
            />
            <ExtField
              type="text"
              label="Особые отметки"
              value={registration_data.note}
              onChange={onChange}
              boundKeys="note"
              textAreaStyle={textAreaStyleNote}
              rows={7}
              disabled={!isPermitted || registration_data.disabled}
              error={errors.note}
            />
          </Col>
          <CenterCol md={6}>
            {
              state.type_image_name
                ? (
                  <img role="presentation" src={config.images + state.type_image_name} className="car-form-image" />
                )
                : (
                  <DivNone />
                )
            }
          </CenterCol>
        </MarginTopRow>
      </>
    );
  },
);

export default RegistrationInfoTab;
