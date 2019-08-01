import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { CarGtnPasspost } from 'redux-main/reducers/modules/autobase/car/@types';
import { FileField } from 'components/old/ui/input/fields';
import usePropulsionTypeOptions from './usePropulsionTypeOptions';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { autobaseGetSetPropulsionType } from 'redux-main/reducers/modules/autobase/actions_by_type/propulsion_type/actions';
import { ReduxState } from 'redux-main/@types/state';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type GtnSelectFieldsStateProps = {};
type GtnSelectFieldsDispatchProps = {
  autobaseGetSetPropulsionType: HandleThunkActionCreator<typeof autobaseGetSetPropulsionType>;
};
type GtnSelectFieldsOwnProps = {
  isPermitted: boolean;
  onChange: any;
  passport_data_errors: any;
  passport_data: CarGtnPasspost;

  page: string;
  path: string;
};
type GtnSelectFieldsMergedProps = (
  GtnSelectFieldsStateProps
  & GtnSelectFieldsDispatchProps
  & GtnSelectFieldsOwnProps
);

type GtnSelectFieldsProps = GtnSelectFieldsMergedProps;

const YearOptions = Array(new Date().getFullYear() - 1990 + 1)
  .fill(0)
  .map((_, i) => ({ value: i + 1990, label: i + 1990 }));

const GtnSelectFields: React.FC<GtnSelectFieldsProps> = React.memo(
  (props) => {
    const {
      passport_data,
      passport_data_errors,
      isPermitted,

      page, path,
    } = props;

    const {
      disabled,
    } = passport_data;

    const {
      propulsionTypeOptions,
    } = usePropulsionTypeOptions(
      props.autobaseGetSetPropulsionType,
      page, path,
    );

    return (
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={6}>
          <ExtField
            type="string"
            label="Серия и номер паспорта"
            value={passport_data.number}
            error={passport_data_errors.number}
            onChange={props.onChange}
            boundKeys="number"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Адрес"
            value={passport_data.address}
            error={passport_data_errors.address}
            onChange={props.onChange}
            boundKeys="address"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Выдан"
            value={passport_data.given_by}
            error={passport_data_errors.given_by}
            onChange={props.onChange}
            boundKeys="given_by"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="select"
            label="Год выпуска"
            value={passport_data.manufactured_at}
            error={passport_data_errors.manufactured_at}
            options={YearOptions}
            onChange={props.onChange}
            boundKeys="manufactured_at"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="number"
            label="Мощность двигателя"
            value={passport_data.engine_power}
            error={passport_data_errors.engine_power}
            onChange={props.onChange}
            boundKeys="engine_power"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="number"
            label="Конструкционная масса, кг"
            value={passport_data.empty_weight}
            error={passport_data_errors.empty_weight}
            onChange={props.onChange}
            boundKeys="empty_weight"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Коробка передач"
            value={passport_data.gearbox}
            error={passport_data_errors.gearbox}
            onChange={props.onChange}
            boundKeys="gearbox"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="select"
            label="Тип движителя"
            value={passport_data.propulsion_type_id}
            error={passport_data_errors.propulsion_type_id}
            options={propulsionTypeOptions}
            onChange={props.onChange}
            boundKeys="propulsion_type_id"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Габаритные размеры, мм"
            value={passport_data.dimensions}
            error={passport_data_errors.dimensions}
            onChange={props.onChange}
            boundKeys="dimensions"
            disabled={!isPermitted || disabled}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={6}>
          <ExtField
            type="string"
            label="Предприятие и изготовитель"
            value={passport_data.manufacturer}
            error={passport_data_errors.manufacturer}
            onChange={props.onChange}
            boundKeys="manufacturer"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Сертификат соответствия"
            value={passport_data.conformity_certificate}
            error={passport_data_errors.conformity_certificate}
            onChange={props.onChange}
            boundKeys="conformity_certificate"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Акт гостехосмотра"
            value={passport_data.tech_inspection_certificate}
            error={passport_data_errors.tech_inspection_certificate}
            onChange={props.onChange}
            boundKeys="tech_inspection_certificate"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Двигатель (номер)"
            value={passport_data.engine_number}
            error={passport_data_errors.engine_number}
            onChange={props.onChange}
            boundKeys="engine_number"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Цвет"
            value={passport_data.body_color}
            error={passport_data_errors.body_color}
            onChange={props.onChange}
            boundKeys="body_color"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Заводской номер машины (рамы)"
            value={passport_data.body_number}
            error={passport_data_errors.body_number}
            onChange={props.onChange}
            boundKeys="body_number"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Номер основного ведущего моста"
            value={passport_data.axle_number}
            error={passport_data_errors.axle_number}
            onChange={props.onChange}
            boundKeys="axle_number"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="number"
            label="Максимальная конструктивная скорость, км/ч"
            value={passport_data.max_speed}
            error={passport_data_errors.max_speed}
            onChange={props.onChange}
            boundKeys="max_speed"
            disabled={!isPermitted || disabled}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={12}>
          <FileField
            label="Файл"
            multiple
            value={passport_data.files}
            onChange={props.onChange}
            boundKeys="files"
            disabled={!isPermitted || disabled}
          />
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  },
);

export default connect<GtnSelectFieldsStateProps, GtnSelectFieldsDispatchProps, GtnSelectFieldsOwnProps, ReduxState>(
  null,
  (dispatch: any) => ({
    autobaseGetSetPropulsionType: (...arg) => (
      dispatch(
        autobaseGetSetPropulsionType(...arg),
      )
    ),
  }),
)(GtnSelectFields);
