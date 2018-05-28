import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { loadingOverlay } from 'components/ui/LoadingOverlay';

import { IPropsPassportInfoTab } from '../PasportInfoTab';

import { ExtField } from 'components/ui/Field.jsx';
import { FileField } from 'components/ui/input/fields';

@loadingOverlay
class GibddTab extends React.Component<IPropsPassportInfoTab, {}> {
  render() {
    const {
      state,
      errors,
      onChange,
      onOverlayLoading,
      isPermitted,
      propulsionTypeOptions = [],
    } = this.props;

    return (
      <Row>
        <Col md={6}>
          <ExtField
            type="string"
            label="Серия и номер паспорта"
            value={state.passport_gtn_number}
            error={errors.passport_gtn_number}
            onChange={onChange}
            boundKeys={['passport_gtn_number']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Адрес"
            value={state.passport_gtn_address}
            error={errors.passport_gtn_address}
            onChange={onChange}
            boundKeys={['passport_gtn_address']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Выдан"
            value={state.passport_gtn_given_by}
            error={errors.passport_gtn_given_by}
            onChange={onChange}
            boundKeys={['passport_gtn_given_by']}
            disabled={!isPermitted}
          />
          <ExtField
            type="select"
            label="Год выпуска"
            value={state.passport_gtn_manufactured_at}
            error={errors.passport_gtn_manufactured_at}
            options={Array((new Date()).getFullYear() - 1990 + 1).fill(0).map((_, i) => ({ value: i + 1990, label: i + 1990 }))}
            onChange={onChange}
            boundKeys={['passport_gtn_manufactured_at']}
            disabled={!isPermitted}
          />
          <ExtField
            type="number"
            label="Мощность двигателя"
            value={state.passport_gtn_engine_power}
            error={errors.passport_gtn_engine_power}
            onChange={onChange}
            boundKeys={['passport_gtn_engine_power']}
            disabled={!isPermitted}
          />
          <ExtField
            type="number"
            label="Конструкционная масса, кг"
            value={state.passport_gtn_empty_weight}
            error={errors.passport_gtn_empty_weight}
            onChange={onChange}
            boundKeys={['passport_gtn_empty_weight']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Коробка передач"
            value={state.passport_gtn_gearbox}
            error={errors.passport_gtn_gearbox}
            onChange={onChange}
            boundKeys={['passport_gtn_gearbox']}
            disabled={!isPermitted}
          />
          <ExtField
            type="select"
            label="Тип движителя"
            value={state.passport_gtn_propulsion_type_id}
            error={errors.passport_gtn_propulsion_type_id}
            options={propulsionTypeOptions}
            onChange={onChange}
            boundKeys={['passport_gtn_propulsion_type_id']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Габаритные размеры, мм"
            value={state.passport_gtn_dimensions}
            error={errors.passport_gtn_dimensions}
            onChange={onChange}
            boundKeys={['passport_gtn_dimensions']}
            disabled={!isPermitted}
          />
        </Col>
        <Col md={6}>
          <ExtField
            type="string"
            label="Предприятие и изготовитель"
            value={state.passport_gtn_manufacturer}
            error={errors.passport_gtn_manufacturer}
            onChange={onChange}
            boundKeys={['passport_gtn_manufacturer']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Сертификат соответствия"
            value={state.passport_gtn_conformity_certificate}
            error={errors.passport_gtn_conformity_certificate}
            onChange={onChange}
            boundKeys={['passport_gtn_conformity_certificate']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Акт гостехосмотра"
            value={state.passport_gtn_tech_inspection_certificate}
            error={errors.passport_gtn_tech_inspection_certificate}
            onChange={onChange}
            boundKeys={['passport_gtn_tech_inspection_certificate']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Двигатель (номер)"
            value={state.passport_gtn_engine_number}
            error={errors.passport_gtn_engine_number}
            onChange={onChange}
            boundKeys={['passport_gtn_engine_number']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Цвет"
            value={state.passport_gtn_body_color}
            error={errors.passport_gtn_body_color}
            onChange={onChange}
            boundKeys={['passport_gtn_body_color']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Заводской номер машины (рамы)"
            value={state.passport_gtn_body_number}
            error={errors.passport_gtn_body_number}
            onChange={onChange}
            boundKeys={['passport_gtn_body_number']}
            disabled={!isPermitted}
          />
          <ExtField
            type="string"
            label="Номер основного ведущего моста"
            value={state.passport_gtn_axle_number}
            error={errors.passport_gtn_axle_number}
            onChange={onChange}
            boundKeys={['passport_gtn_axle_number']}
            disabled={!isPermitted}
          />
          <ExtField
            type="number"
            label="Максимальная конструктивная скорость, км/ч"
            value={state.passport_gtn_max_speed}
            error={errors.passport_gtn_max_speed}
            onChange={onChange}
            boundKeys={['passport_gtn_max_speed']}
            disabled={!isPermitted}
          />
        </Col>
        <Col md={12}>
            <FileField
              label="Файл"
              multiple
              value={state.passport_gtn_files}
              onChange={onChange}
              boundKeys={['passport_gtn_files']}
              isLoading={onOverlayLoading}
              disabled={!isPermitted}
            />
          </Col>
      </Row>
    );
  }
}

export default GibddTab;
