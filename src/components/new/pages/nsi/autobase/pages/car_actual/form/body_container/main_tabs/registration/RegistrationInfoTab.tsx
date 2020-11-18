import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { CenterCol, MarginTopRow } from './styled';
import { get } from 'lodash';
import config from 'config';
import { DivNone } from 'global-styled/global-styled';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../@types/CarForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FileField } from 'components/old/ui/input/fields';
import { Redirect, useLocation } from 'react-router-dom';

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
    const location = useLocation();
    const {
      registration_data,
      is_gibdd_passport,
      is_gtn_passport,
    } = state;
    registration_data.passport_data_type = state.passport_data.type;
    const certificateNumberLength = registration_data.passport_data_type === 'GIBDD' ? '10' : '8';

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

    if(
      !registration_data.passport_data_type
      && (is_gibdd_passport || is_gtn_passport)
    ) {
      global.NOTIFICATION_SYSTEM.notify('Для ввода информациии о регистрации необходимо ввести данные паспорта ТС', 'info', 'tr');
      return <Redirect to={`/nsi/autobase/car_actual/${state.asuods_id}/passport_info${location.search}`} />;
    }

    return (
      <>
        <MarginTopRow>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Серия и номер свидетельства о регистрации"
              value={registration_data.certificate_number}
              onChange={onChange}
              hint={
                `${`Поле "Серия и номер свидетельства о регистрации" для ТС должно содержать ${certificateNumberLength} символов.`}
                 ${'В качестве символов допустимо использовать цифры (0-9) и 12 букв алфавита кириллицы в'}
                 ${'верхнем регистре: А, В, Е, К, М, Н, О, Р, С, Т, О, У и Х.'}
                `
              }
              boundKeys="certificate_number"
              disabled={!isPermitted || registration_data.disabled}
              error={errors.certificate_number}
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
            <FileField
              label="Файл"
              multiple
              value={registration_data.files}
              onChange={onChange}
              boundKeys="files"
              disabled={!isPermitted}
              withDateTime
              kind="registration_certificate"
            />
          </EtsBootstrap.Col>
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
