import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { loadingOverlay } from 'components/ui/LoadingOverlay';

import { IPropsPassportInfoTab } from '../PasportInfoTab';

import { onChangeWithKeys } from 'components/compositions/hoc';
import BaseField from 'components/ui/Field.jsx';
import { FileField } from 'components/ui/input/fields';

const Field = onChangeWithKeys(BaseField);

@loadingOverlay
class GntTab extends React.Component<IPropsPassportInfoTab> {
  render() {
    const {
      state,
      errors,
      onChange,
      onOverlayLoading,
      isPermitted,
      carCategoryOptions = [],
      engineTypeOptions = [],
      countryOptions = [],
      typesOptions = [],
    } = this.props;

    return (
      <Row>
        <Col md={6}>
          <Field
            type="string"
            label="VIN (Идентификационный номер)"
            value={state.passport_gibdd_vin}
            error={errors.passport_gibdd_vin}
            onChange={onChange}
            boundKeys={['passport_gibdd_vin']}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Категория транспортного средства"
            value={state.passport_gibdd_category_id}
            error={errors.passport_gibdd_category_id}
            options={carCategoryOptions}
            onChange={onChange}
            boundKeys={['passport_gibdd_category_id']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Цвет кузова"
            value={state.passport_gibdd_body_color}
            error={errors.passport_gibdd_body_color}
            onChange={onChange}
            boundKeys={['passport_gibdd_body_color']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Модель двигателя"
            value={state.passport_gibdd_engine_model}
            error={errors.passport_gibdd_engine_model}
            onChange={onChange}
            boundKeys={['passport_gibdd_engine_model']}
            disabled={!isPermitted}
          />
          <Field
            type="number"
            label="Мощность двигателя"
            value={state.passport_gibdd_engine_power}
            error={errors.passport_gibdd_engine_power}
            onChange={onChange}
            boundKeys={['passport_gibdd_engine_power']}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Тип двигателя"
            value={state.passport_gibdd_engine_type_id}
            error={errors.passport_gibdd_engine_type_id}
            options={engineTypeOptions}
            onChange={onChange}
            boundKeys={['passport_gibdd_engine_type_id']}
            disabled={!isPermitted}
          />
          <Field
            type="number"
            label="Разрешенная максимальная масса, кг"
            value={state.passport_gibdd_max_weight}
            error={errors.passport_gibdd_max_weight}
            onChange={onChange}
            boundKeys={['passport_gibdd_max_weight']}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Экологический класс"
            value={state.passport_gibdd_environmental_class}
            error={errors.passport_gibdd_environmental_class}
            options={Array(6).fill(1).map((d, i) => ({ value: `euro${i + 1}`, label: `Евро-${i + 1}` }))}
            onChange={onChange}
            boundKeys={['passport_gibdd_environmental_class']}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Страна вывоза автомобиля"
            value={state.passport_gibdd_exporter_country_id}
            error={errors.passport_gibdd_exporter_country_id}
            options={countryOptions}
            onChange={onChange}
            boundKeys={['passport_gibdd_exporter_country_id']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Серия и номер таможенной декларации"
            value={state.passport_gibdd_customs_declaration}
            error={errors.passport_gibdd_customs_declaration}
            onChange={onChange}
            boundKeys={['passport_gibdd_customs_declaration']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Адрес организации, выдавшей ПТС"
            value={state.passport_gibdd_company_address}
            error={errors.passport_gibdd_company_address}
            onChange={onChange}
            boundKeys={['passport_gibdd_company_address']}
            disabled={!isPermitted}
          />
        </Col>
        <Col md={6}>
          <Field
            type="select"
            label="Тип транспортного средства"
            value={state.passport_gibdd_func_type_id}
            error={errors.passport_gibdd_func_type_id}
            options={typesOptions}
            onChange={onChange}
            boundKeys={['passport_gibdd_func_type_id']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Кузов (номер)"
            value={state.passport_gibdd_body_number}
            error={errors.passport_gibdd_body_number}
            onChange={onChange}
            boundKeys={['passport_gibdd_body_number']}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Год выпуска"
            value={state.passport_gibdd_manufactured_at}
            error={errors.passport_gibdd_manufactured_at}
            options={Array((new Date()).getFullYear() - 1990 + 1).fill(0).map((_, i) => ({ value: i + 1990, label: i + 1990 }))}
            onChange={onChange}
            boundKeys={['passport_gibdd_manufactured_at']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Двигатель (номер)"
            value={state.passport_gibdd_engine_number}
            error={errors.passport_gibdd_engine_number}
            onChange={onChange}
            boundKeys={['passport_gibdd_engine_number']}
            disabled={!isPermitted}
          />
          <Field
            type="number"
            label="Рабочий объем двигателя"
            value={state.passport_gibdd_engine_volumne}
            error={errors.passport_gibdd_engine_volumne}
            onChange={onChange}
            boundKeys={['passport_gibdd_engine_volumne']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Шасси (рама)"
            value={state.passport_gibdd_chassis}
            error={errors.passport_gibdd_chassis}
            onChange={onChange}
            boundKeys={['passport_gibdd_chassis']}
            disabled={!isPermitted}
          />
          <Field
            type="number"
            label="Масса без нагрузки, кг"
            value={state.passport_gibdd_empty_weight}
            error={errors.passport_gibdd_empty_weight}
            onChange={onChange}
            boundKeys={['passport_gibdd_empty_weight']}
            disabled={!isPermitted}
          />
          <Field
            type="select"
            label="Страна-изготовитель"
            value={state.passport_gibdd_origin_country_id}
            error={errors.passport_gibdd_origin_country_id}
            options={countryOptions}
            onChange={onChange}
            boundKeys={['passport_gibdd_origin_country_id']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Таможенные ограничения"
            value={state.passport_gibdd_customs_restrictions}
            error={errors.passport_gibdd_customs_restrictions}
            onChange={onChange}
            boundKeys={['passport_gibdd_customs_restrictions']}
            disabled={!isPermitted}
          />
          <Field
            type="string"
            label="Адрес"
            value={state.passport_gibdd_address}
            error={errors.passport_gibdd_address}
            onChange={onChange}
            boundKeys={['passport_gibdd_address']}
            disabled={!isPermitted}
          />
          <Field
            type="date"
            label="Дата выдачи ПТС"
            date={state.passport_gibdd_given_at}
            error={errors.passport_gibdd_given_at}
            time={false}
            onChange={onChange}
            boundKeys={['passport_gibdd_given_at']}
            disabled={!isPermitted}
          />
        </Col>
        <Col md={12}>
          <FileField
            label="Файл"
            multiple
            value={state.passport_gibdd_files}
            onChange={onChange}
            boundKeys={['passport_gibdd_files']}
            isLoading={onOverlayLoading}
            disabled={!isPermitted}
          />
        </Col>
      </Row>
    );
  }
}

export default GntTab;
