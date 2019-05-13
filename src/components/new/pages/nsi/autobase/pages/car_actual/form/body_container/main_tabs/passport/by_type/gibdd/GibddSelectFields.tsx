import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { CarGibddPasspost } from 'redux-main/reducers/modules/autobase/car/@types';
import { FileField } from 'components/ui/input/fields';
import useCarTypesOptions from 'components/new/utils/hooks/services/useOptions/useCarTypesOptions';
import useCountryOptions from 'components/new/utils/hooks/services/useOptions/useCountryOptions';
import useAutobaseCarCategoryOptions from 'components/new/utils/hooks/services/useOptions/useAutobaseCarCategoryOptions';
import useAutobaseEngineTypeOptions from 'components/new/utils/hooks/services/useOptions/useAutobaseEngineTypeOptions';

type GibddSelectFieldsStateProps = {};
type GibddSelectFieldsDispatchProps = {
};
type GibddSelectFieldsOwnProps = {
  isPermitted: boolean;
  onChange: any;
  passport_data_errors: any;
  passport_data: CarGibddPasspost;

  page: string;
  path: string;
};
type GibddSelectFieldsMergedProps = (
  GibddSelectFieldsStateProps
  & GibddSelectFieldsDispatchProps
  & GibddSelectFieldsOwnProps
);

type GibddSelectFieldsProps = GibddSelectFieldsMergedProps;

const GibddSelectFields: React.FC<GibddSelectFieldsProps> = React.memo(
  (props) => {
    const {
      passport_data,
      passport_data_errors,
      isPermitted,
    } = props;

    const {
      disabled,
    } = passport_data;

    const carCategoryOptionData = useAutobaseCarCategoryOptions();
    const engineTypeOptionData = useAutobaseEngineTypeOptions();
    const carFuncTypesOptionData = useCarTypesOptions();
    const countryOptionData = useCountryOptions();

    return (
      <Row>
        <Col md={6}>
          <ExtField
            type="string"
            label="Серия и номер паспорта"
            value={passport_data.seria_number}
            error={passport_data_errors.seria_number}
            onChange={props.onChange}
            boundKeys="seria_number"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="VIN (Идентификационный номер)"
            value={passport_data.vin}
            error={passport_data_errors.vin}
            onChange={props.onChange}
            boundKeys="vin"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="select"
            label="Категория транспортного средства"
            value={passport_data.category_id}
            error={passport_data_errors.category_id}
            options={carCategoryOptionData.options}
            onChange={props.onChange}
            boundKeys="category_id"
            disabled={!isPermitted || disabled}
            etsIsLoading={carCategoryOptionData.isLoading}
          />
          <ExtField
            type="string"
            label="Цвет кузова"
            value={passport_data.body_color}
            error={passport_data_errors.body_color}
            onChange={props.onChange}
            boundKeys="body_color"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Модель двигателя"
            value={passport_data.engine_model}
            error={passport_data_errors.engine_model}
            onChange={props.onChange}
            boundKeys="engine_model"
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
            type="select"
            label="Тип двигателя"
            value={passport_data.engine_type_id}
            error={passport_data_errors.engine_type_id}
            options={engineTypeOptionData.options}
            onChange={props.onChange}
            boundKeys="engine_type_id"
            disabled={!isPermitted || disabled}
            etsIsLoading={engineTypeOptionData.isLoading}
          />
          <ExtField
            type="number"
            label="Разрешенная максимальная масса, кг"
            value={passport_data.max_weight}
            error={passport_data_errors.max_weight}
            onChange={props.onChange}
            boundKeys="max_weight"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="select"
            label="Экологический класс"
            value={passport_data.environmental_class}
            error={passport_data_errors.environmental_class}
            options={Array(6).fill(1).map((d, i) => ({ value: `euro${i + 1}`, label: `Евро-${i + 1}` }))}
            onChange={props.onChange}
            boundKeys="environmental_class"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="select"
            label="Страна вывоза автомобиля"
            value={passport_data.exporter_country_id}
            error={passport_data_errors.exporter_country_id}
            options={countryOptionData.options}
            onChange={props.onChange}
            boundKeys="exporter_country_id"
            disabled={!isPermitted || disabled}
            etsIsLoading={countryOptionData.isLoading}
          />
          <ExtField
            type="string"
            label="Серия и номер таможенной декларации"
            value={passport_data.customs_declaration}
            error={passport_data_errors.customs_declaration}
            onChange={props.onChange}
            boundKeys="customs_declaration"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Адрес организации, выдавшей ПТС"
            value={passport_data.company_address}
            error={passport_data_errors.company_address}
            onChange={props.onChange}
            boundKeys="company_address"
            disabled={!isPermitted || disabled}
          />
        </Col>
        <Col md={6}>
          <ExtField
            type="select"
            label="Тип транспортного средства"
            value={passport_data.func_type_id}
            error={passport_data_errors.func_type_id}
            options={carFuncTypesOptionData.options}
            onChange={props.onChange}
            boundKeys="func_type_id"
            disabled={!isPermitted || disabled}
            etsIsLoading={carFuncTypesOptionData.isLoading}
          />
          <ExtField
            type="string"
            label="Кузов (номер)"
            value={passport_data.body_number}
            error={passport_data_errors.body_number}
            onChange={props.onChange}
            boundKeys="body_number"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="select"
            label="Год выпуска"
            value={passport_data.manufactured_at}
            error={passport_data_errors.manufactured_at}
            options={Array((new Date()).getFullYear() - 1990 + 1).fill(0).map((_, i) => ({ value: i + 1990, label: i + 1990 }))}
            onChange={props.onChange}
            boundKeys="manufactured_at"
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
            type="number"
            label="Рабочий объем двигателя"
            value={passport_data.engine_volumne}
            error={passport_data_errors.engine_volumne}
            onChange={props.onChange}
            boundKeys="engine_volumne"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="string"
            label="Шасси (рама)"
            value={passport_data.chassis}
            error={passport_data_errors.chassis}
            onChange={props.onChange}
            boundKeys="chassis"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="number"
            label="Масса без нагрузки, кг"
            value={passport_data.empty_weight}
            error={passport_data_errors.empty_weight}
            onChange={props.onChange}
            boundKeys="empty_weight"
            disabled={!isPermitted || disabled}
          />
          <ExtField
            type="select"
            label="Страна-изготовитель"
            value={passport_data.origin_country_id}
            error={passport_data_errors.origin_country_id}
            options={countryOptionData.options}
            onChange={props.onChange}
            boundKeys="origin_country_id"
            disabled={!isPermitted || disabled}
            etsIsLoading={countryOptionData.isLoading}
          />
          <ExtField
            type="string"
            label="Таможенные ограничения"
            value={passport_data.customs_restrictions}
            error={passport_data_errors.customs_restrictions}
            onChange={props.onChange}
            boundKeys="customs_restrictions"
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
            type="date"
            label="Дата выдачи ПТС"
            date={passport_data.given_at}
            error={passport_data_errors.given_at}
            time={false}
            onChange={props.onChange}
            boundKeys="given_at"
            disabled={!isPermitted || disabled}
            makeGoodFormat
          />
        </Col>
        <Col md={12}>
          <FileField
            label="Файл"
            multiple
            value={passport_data.files}
            onChange={props.onChange}
            boundKeys="files"
            disabled={!isPermitted || disabled}
          />
        </Col>
      </Row>
    );
  },
);

export default GibddSelectFields;
