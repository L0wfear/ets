import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { CenterCol, FlexRow } from './styled';
import config from 'config';
import { DivNone } from 'global-styled/global-styled';
import { connect } from 'react-redux';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { FormWithHandleChange, FormWithHandleChangeBoolean } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CarWrap } from '../../../@types/CarForm';
import FieldSelectDriverCar from './inside_fields/drivers_data/FieldSelectDriverCar';
import { MarginTopRow } from '../registration/styled';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';

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

    return (
      <MarginTopRow>
        <Col md={12}>
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
              <ExtField inline type="string" label="Рег. номер ТС" readOnly value={state.gov_number || 'Не указано'} />
              <ExtField inline type="string" label="Модель ТС" readOnly value={state.special_model_name || 'Не указано'} />
              <ExtField inline type="string" label="Марка шасси" readOnly value={state.model_name || 'Не указано'} />
              <ExtField inline type="string" label="Тип техники" readOnly value={state.type_name || 'Не указано'} />
              <ExtField inline type="string" label="Группа техники" readOnly value={state.car_group_name || 'Не указано'} />
            </CenterCol>
          </FlexRow>
          <Row>
            <Col md={6}>
              <ExtField
                type="date"
                time={false}
                label="Дата ввода ТС в эксплуатацию"
                date={state.exploitation_date_start}
                onChange={props.onChange}
                boundKeys="exploitation_date_start"
                disabled={!isPermitted}
                makeGoodFormat
              />
              <ExtField
                type="string"
                label="Гаражный номер"
                value={state.garage_number}
                onChange={props.onChange}
                boundKeys="garage_number"
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label="Подразделение"
                options={props.STRUCTURES}
                value={state.company_structure_id}
                onChange={onChangeCompanyStructure}
                boundKeys="company_structure_id"
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
            </Col>
            <Col md={6}>
              <ExtField
                type="number"
                label="Поправочный коэффициент"
                value={state.fuel_correction_rate}
                onChange={props.onChange}
                boundKeys="fuel_correction_rate"
                disabled={!isPermitted}
              />
              <ExtField
                type="text"
                label="Примечание"
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
            </Col>
            <Col md={12}>
              <FieldSelectDriverCar
                gov_number={state.gov_number}
                drivers_data={state.drivers_data}
                onChange={props.onChangeBoolean}
                isPermitted={isPermitted}

                page={props.page}
                path={props.path}
              />
            </Col>
          </Row>
        </Col>
      </MarginTopRow>
    );
  },
);

export default connect<any, any, any, ReduxState>(
  (state) => ({
    STRUCTURES: getSessionStructuresOptions(state),
  }),
)(MainInfoTab);
