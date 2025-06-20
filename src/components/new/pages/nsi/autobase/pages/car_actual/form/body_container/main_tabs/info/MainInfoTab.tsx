import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { CenterCol, FlexRow } from './styled';
import config from 'config';
import { DivNone } from 'global-styled/global-styled';
import { connect } from 'react-redux';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../@types/CarForm';
import FieldSelectDriverCar from './inside_fields/drivers_data/FieldSelectDriverCar';
import { MarginTopRow } from '../registration/styled';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import FieldSelectEngine from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/FieldSelectEngine';
import { useMileageOptions } from '../../../utils';
import carActualPermissions from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/permissions';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';

type MainInfoTab = {
  isPermitted: boolean;
  formState: CarWrap;
  formErrors: any;
  onChange: FormWithHandleChange<CarWrap>;
  onChangeBoolean: FormWithHandleChangeBoolean<CarWrap>;
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  page: string;
  path: string;
};

const noteTextStyled = { resize: 'none' };

const MainInfoTab: React.FC<MainInfoTab> = React.memo(
  (props) => {
    const {
      isPermitted,
      formState: state,
      formErrors: errors,
    } = props;

    const onChangeCompanyStructure = React.useCallback(
      (key, value) => {
        global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);

        props.onChange(key, value);
      },
      [props.onChange],
    );

    const mileageTypeOptions = useMileageOptions({page: props.page, path: props.path});
    const permissions = etsUseSelector((state) => getSessionState(state).userData.permissionsSet);
    const canUpdateMileageType = permissions.has(carActualPermissions.updateMileage);

    return (
      <MarginTopRow>
        <EtsBootstrap.Col md={12}>
          <FlexRow>
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
            <CenterCol md={6}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={6}>
                  <ExtField inline type="string" label="Рег. номер ТС" readOnly value={state.gov_number || 'Не указано'} />
                  <ExtField inline type="string" label="VIN (АСУ ОДС)" readOnly value={state.vin || 'Не указано'} />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={6}>
                  <ExtField inline type="string" label="Модель ТС" readOnly value={state.special_model_name || 'Не указано'} />
                  <ExtField inline type="string" label="Марка шасси" readOnly value={state.model_name || 'Не указано'} />
                  <ExtField inline type="string" label="Тип техники" readOnly value={state.type_name || 'Не указано'} />
                  <ExtField inline type="string" label="Группа техники" readOnly value={state.car_group_name || 'Не указано'} />
                  <ExtField inline type="string" label="Состояние" readOnly value={state.condition_text || 'Не указано'} />
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </CenterCol>
          </FlexRow>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="date"
                time={false}
                label="Дата ввода ТС в эксплуатацию"
                date={state.exploitation_date_start}
                onChange={props.onChange}
                boundKeys="exploitation_date_start"
                disabled={!isPermitted}
                error={errors.exploitation_date_start}
                makeGoodFormat
              />
              <ExtField
                type="string"
                label="Гаражный номер"
                value={state.garage_number}
                onChange={props.onChange}
                boundKeys="garage_number"
                disabled={!isPermitted}
                error={errors.garage_number}
              />
              <ExtField
                type="select"
                label="Подразделение"
                options={props.STRUCTURES}
                value={state.company_structure_id}
                onChange={onChangeCompanyStructure}
                boundKeys="company_structure_id"
                error={errors.company_structure_id}
                disabled={!isPermitted}
              />
              <ExtField
                type="string"
                label="Адрес стоянки"
                value={state.parking_address}
                onChange={props.onChange}
                boundKeys="parking_address"
                disabled={!isPermitted}
                error={errors.parking_address}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="number"
                label="Поправочный коэффициент"
                value={state.fuel_correction_rate}
                onChange={props.onChange}
                boundKeys="fuel_correction_rate"
                error={errors.fuel_correction_rate}
                disabled={!isPermitted}
              />
              <ExtField
                type="text"
                label="Комментарий"
                value={state.note}
                onChange={props.onChange}
                boundKeys="note"
                textAreaStyle={noteTextStyled}
                rows={7}
                disabled={!isPermitted}
                error={errors.note}
              />
              <ExtField
                type="boolean"
                label="Общее"
                value={state.is_common}
                onChange={props.onChangeBoolean}
                boundKeys="is_common"
                disabled={!isPermitted}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={12}>
              <FieldSelectDriverCar
                gov_number={state.gov_number}
                type_id={state.type_id}
                drivers_data={state.drivers_data}
                employee_data={state.employee_data}
                onChange={props.onChangeBoolean}
                isPermitted={isPermitted}
                formErrors={errors.drivers_data}
                page={props.page}
                path={props.path}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Режим работы"
                value={state.operating_mode}
                onChange={props.onChange}
                boundKeys="operating_mode"
                disabled={!isPermitted}
                error={errors.operating_mode}
              />
              <ExtField
                type="select"
                label="Расчет пробега"
                options={mileageTypeOptions}
                value={state.mileage_type_id}
                onChange={props.onChange}
                boundKeys="mileage_type_id"
                error={errors.mileage_type_id}
                disabled={!isPermitted || !canUpdateMileageType}
                clearable={false}
              />
            </EtsBootstrap.Col>
            <FieldSelectEngine
              onChange={props.onChangeBoolean}
              isPermitted={isPermitted}
              formErrors={errors}
              page={props.page}
              path={props.path}
              engine_kind_ids={state.engine_kind_ids}
              car_id={state.asuods_id}
              is_main
            />
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
      </MarginTopRow>
    );
  },
);

export default connect<any, any, any, ReduxState>(
  (state) => ({
    STRUCTURES: getSessionStructuresOptions(state),
  }),
)(MainInfoTab);
