import * as React from 'react';
import { BlockCarInfoProps } from '../../@types/BlockCarInfo';
import { ExtField } from 'components/old/ui/new/field/ExtField';
// import { makeDate, makeTime } from 'components/@next/@utils/dates/dates';
// import { DivNone } from 'global-styled/global-styled';
import FieldCarsConditionsCarMarka from './inside_fields/marka/FieldCarsConditionsCarMarka';
import FieldCarsConditionsCarModel from './inside_fields/model/FieldCarsConditionsCarModel';
import FieldCarsConditionsCarType from './inside_fields/type/FieldCarsConditionsCarType';
import FieldCarsConditionsCarSeason from './inside_fields/season/FieldCarsConditionsCarSeason';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FormWithHandleChangeBoolean } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { AdditionalInfoBlock, AdditionalInfoWrapper } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/main_data/styled';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { autobaseGetInspectConfig } from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import useCountryOptions from 'components/new/utils/hooks/services/useOptions/useCountryOptions';
import { get } from 'lodash';
import { stateExploitationOptions, factStatusOptions, statusAtCheckOptions } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/options';
import IAVisibleWarningContainer from 'components/new/pages/inspection/container/filed_to_check/IAVisibleWarningContainer';
import { filedToCheckDefectDataOuter, filedToCheckDefectDataFirstStart, filedToCheckDefectDataOtherFirst, } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/filedToCheckCarInfoMainCheckData';
import FieldCarsConditionsCarSelectFactStatus from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/fact_status_and_other/FieldCarsConditionsCarSelectFactStatus';
import { HrDelimiter } from 'global-styled/global-styled';

type BlockCarInfoMainDataProps = (
  {
    isPermitted: boolean;
    handleChangeBoolean: FormWithHandleChangeBoolean<CarsConditionCars>;
  }
) & Pick<BlockCarInfoProps, 'IS_CREATING' | 'formState' | 'formErrors' | 'handleChange' | 'page' | 'path'>;

const BlockCarInfoMainData: React.FC<BlockCarInfoMainDataProps> = React.memo(
  (props) => {
    const {
      IS_CREATING,
      formState: state,
      formErrors: errors,
    } = props;

    const [additionalInfoMainShow, SetAdditionalInfoMainShow] = React.useState(false); // <<< заменить на false
    const [defectShow, SetDefectShow] = React.useState(false); // <<< заменить на false
    const [inspectionConfig, setInspectionConfig] = React.useState(null);
    const countryOptionData = useCountryOptions();
    const dispatch = etsUseDispatch();

    const callBackToLoadConfig = React.useCallback(
      () => {
        const loadData = async () => {
          try {
            const result = await dispatch(autobaseGetInspectConfig({ page: '', path: '' }));
            if (result) {
              const configOptionsList = Object.keys(result).reduce((newObj, key ) => {
                const configOptionsByKeyList = Object.entries(result[key]).map(([keyEntry, valueEntry]) => {
                  return {
                    value: keyEntry,
                    label: valueEntry,
                  };
                });
                return {
                  ...newObj,
                  [key]: configOptionsByKeyList,
                };
              }, {});
              setInspectionConfig(configOptionsList);
            }
          } catch (error) {
            console.error(error); //tslint:disable-line
          }
        };
        loadData();
      },
      [dispatch],
    );
    const handleChangeAdditionalInfoMain = React.useCallback(
      () => {
        SetAdditionalInfoMainShow(!additionalInfoMainShow);
      },
      [SetAdditionalInfoMainShow, additionalInfoMainShow],
    );

    const handleChangeDefectShow = React.useCallback(
      () => {
        SetDefectShow(!defectShow);
      },
      [SetDefectShow, defectShow],
    );

    React.useEffect(() => {
      callBackToLoadConfig();
    }, []);

    React.useEffect(() => {
      if (state.data.osago_not_required) {
        props.handleChange({
          osago: null,
          osago_finished_at: null,
        });
      }
    },
    [state.data.osago_not_required]);

    const handleChangeDataForIA = React.useCallback(
      (data) => {
        props.handleChange({
          data: {
            ...props.formState.data,
            ...data,
          },
        });
      },
      [state.data, props.handleChange, inspectionConfig],
    );

    const handleChangeDataOsago = React.useCallback(
      () => {
        props.handleChange({
          data: {
            ...state.data,
            osago_not_required: !state.data.osago_not_required,
          },
        });
      },
      [state.data, props.handleChange, inspectionConfig],
    );

    const handleChangeData = React.useCallback(
      (key, event) => {
        props.handleChange({
          data: {
            ...state.data,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [state.data, props.handleChange, inspectionConfig],
    );

    const handleChangeDataOptions = React.useCallback(
      (key, event) => {
        props.handleChange({
          data: {
            ...state.data,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [state.data, props.handleChange, inspectionConfig],
    );

    return (
      <React.Fragment>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={!IS_CREATING ? 6 : 12}>
            <ExtField
              id="gov_number"
              type="string"
              label="Гос. номер:"
              value={state.gov_number}
              readOnly={!IS_CREATING}
              onChange={props.handleChange}
              error={errors.gov_number}
              boundKeys="gov_number"
              disabled={!props.isPermitted}
              inline
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={!IS_CREATING ? 6 : 12}>
            {
              !IS_CREATING
                ? (
                  <ExtField
                    type="string"
                    label="Марка:"
                    value={state.marka}
                    readOnly
                    inline
                  />
                )
                : (
                  <FieldCarsConditionsCarMarka
                    value={state.marka}
                    error={errors.marka}

                    handleChange={props.handleChange}
                    isPermitted={props.isPermitted}
                    page={props.page}
                    path={props.path}
                  />
                )
            }
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={!IS_CREATING ? 6 : 12}>
            {
              !IS_CREATING
                ? (
                  <ExtField
                    type="string"
                    label="Модель:"
                    value={state.model}
                    readOnly
                    inline
                  />
                )
                : (
                  <FieldCarsConditionsCarModel
                    value={state.model}
                    error={errors.model}

                    handleChange={props.handleChange}
                    isPermitted={props.isPermitted}
                    page={props.page}
                    path={props.path}
                  />
                )
            }
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={!IS_CREATING ? 6 : 12}>
            {
              !IS_CREATING
                ? (
                  <ExtField
                    type="string"
                    label="Тип ТС:"
                    value={state.type}
                    readOnly
                    inline
                  />
                )
                : (
                  <FieldCarsConditionsCarType
                    value={state.type}
                    error={errors.type}

                    handleChange={props.handleChange}
                    isPermitted={props.isPermitted}
                    page={props.page}
                    path={props.path}
                  />
                )
            }
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={!IS_CREATING ? 6 : 12}>
            {
              !IS_CREATING
                ? (
                  <ExtField
                    type="string"
                    label="Сезон:"
                    value={state.season}
                    readOnly
                    inline
                  />
                )
                : (
                  <FieldCarsConditionsCarSeason
                    value={state.season}
                    error={errors.season}

                    handleChange={props.handleChange}
                    isPermitted={props.isPermitted}
                    page={props.page}
                    path={props.path}
                  />
                )
            }
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="VIN (из системы):"
              value={state.vin}
              onChange={props.handleChange}
              error={errors.vin}
              boundKeys="vin"
              disabled={!props.isPermitted}
              readOnly={!IS_CREATING}
            />
          </EtsBootstrap.Col>
          {
            !IS_CREATING &&
              <React.Fragment>
                <EtsBootstrap.Col md={6}>
                  <ExtField
                    type="boolean"
                    label="Некорректный VIN:"
                    value={state.vin_incorrect}
                    onChange={props.handleChangeBoolean}
                    error={errors.vin_incorrect}
                    boundKeys="vin_incorrect"
                    disabled={!props.isPermitted}
                  />
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={12}>
                  <ExtField
                    type="string"
                    label="VIN (ручной ввод):"
                    value={state.vin_by_hand}
                    onChange={props.handleChange}
                    error={errors.vin_by_hand}
                    boundKeys="vin_by_hand"
                    disabled={!props.isPermitted}
                    hidden={!state.vin_incorrect}
                  />
                </EtsBootstrap.Col>
              </React.Fragment>
          }
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Заводской номер (из системы):"
              value={state.body_number}
              onChange={props.handleChange}
              error={errors.body_number}
              boundKeys="body_number"
              disabled={!props.isPermitted}
              readOnly={!IS_CREATING}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="boolean"
              label="Некорректный заводской номер:"
              value={state.body_number_incorrect}
              onChange={props.handleChangeBoolean}
              error={errors.body_number_incorrect}
              boundKeys="body_number_incorrect"
              disabled={!props.isPermitted}
              hidden={IS_CREATING}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="string"
              label="Заводской номер (ручной ввод):"
              value={state.body_number_by_hand}
              onChange={props.handleChange}
              error={errors.body_number_by_hand}
              boundKeys="body_number_by_hand"
              disabled={!props.isPermitted}
              hidden={!state.body_number_incorrect || IS_CREATING}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <AdditionalInfoWrapper>
              <EtsBootstrap.Button onClick={handleChangeAdditionalInfoMain}>
                {
                  additionalInfoMainShow
                    ? <EtsBootstrap.Glyphicon glyph="minus" />
                    : <EtsBootstrap.Glyphicon glyph="plus" />
                }
                Доп. информация
              </EtsBootstrap.Button>
              {
                additionalInfoMainShow &&
                  <AdditionalInfoBlock>
                    <EtsBootstrap.Row>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          type="number"
                          label="Год выпуска:"
                          value={state.manufactured_at}
                          onChange={props.handleChange}
                          error={errors.manufactured_at}
                          boundKeys="manufactured_at"
                          disabled={!props.isPermitted}
                        />
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          id="environmental_class_id"
                          type="select"
                          label="Экологический стандарт ТС"
                          value={state.environmental_class}
                          onChange={props.handleChange}
                          options={ get(inspectionConfig, 'environmental_class', [])}
                          error={errors.environmental_class}
                          clearable={false}
                          disabled={!props.isPermitted}
                          boundKeys={'environmental_class'}
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Row>
                    <EtsBootstrap.Row>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          id="engine_type_id"
                          type="select"
                          label="Тип двигателя"
                          value={state.engine_type}
                          onChange={props.handleChange}
                          options={get(inspectionConfig, 'engine_type', [])}
                          error={errors.engine_type}
                          clearable={false}
                          disabled={!props.isPermitted}
                          boundKeys={'engine_type'}
                        />
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          type="number"
                          label="Разрешенная масса (кг)"
                          value={state.max_weight}
                          error={errors.max_weight}
                          onChange={props.handleChange}
                          boundKeys="max_weight"
                          disabled={!props.isPermitted}
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Row>
                    <EtsBootstrap.Row>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          id="origin_country_id"
                          type="select"
                          label="Страна изготовитель"
                          value={state.origin_country}
                          onChange={props.handleChange}
                          options={ countryOptionData.options}
                          error={errors.origin_country}
                          clearable={false}
                          disabled={!props.isPermitted}
                          etsIsLoading={countryOptionData.isLoading}
                          boundKeys={'origin_country'}
                        />
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          id="classifier_id"
                          type="select"
                          label="Классификатор"
                          value={state.data.classifier}
                          onChange={handleChangeDataOptions}
                          options={ get(inspectionConfig, 'classifier', []) }
                          error={errors.data.classifier}
                          clearable={false}
                          disabled={!props.isPermitted}
                          boundKeys={"classifier"}
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Row>
                    <EtsBootstrap.Row>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          id="kind_id"
                          type="select"
                          label="Вид техники"
                          value={state.kind}
                          onChange={props.handleChange}
                          options={ get(inspectionConfig, 'kind', []) }
                          error={errors.kind}
                          clearable={false}
                          disabled={!props.isPermitted}
                          boundKeys={'kind'}
                        />
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col md={6}>
                        <ExtField
                          id="kind_purchase_id"
                          type="select"
                          label="Вид приобретения"
                          value={state.kind_purchase}
                          onChange={props.handleChange}
                          options={ get(inspectionConfig, 'kind_purchase', []) }
                          error={errors.kind_purchase}
                          clearable={false}
                          disabled={!props.isPermitted}
                          boundKeys={'kind_purchase'}
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Row>
                  </AdditionalInfoBlock>
              }
            </AdditionalInfoWrapper>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Номер ОСАГО:"
              value={state.osago}
              onChange={props.handleChange}
              error={errors.osago}
              boundKeys="osago"
              disabled={!props.isPermitted || state.data.osago_not_required}
          />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="Действует до:"
              value={state.osago_finished_at}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.osago_finished_at}
              boundKeys="osago_finished_at"
              disabled={!props.isPermitted || state.data.osago_not_required}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="boolean"
              label="ОСАГО не требуется:"
              value={state.data.osago_not_required}
              onChange={handleChangeDataOsago}
              boundKeys="osago_not_required"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Номер диагностической карты:"
              value={state.diagnostic_card}
              onChange={props.handleChange}
              error={errors.diagnostic_card}
              boundKeys="diagnostic_card"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="Действует до:"
              value={state.diagnostic_card_finished_at}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.diagnostic_card_finished_at}
              boundKeys="diagnostic_card_finished_at"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Техника относится к ГБУ Жилищник района:"
              value={state.gby_district}
              onChange={props.handleChange}
              error={errors.gby_district}
              boundKeys="gby_district"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Техника эксплуатируется жилищником района:"
              value={state.gby_operation_district}
              onChange={props.handleChange}
              error={errors.gby_operation_district}
              boundKeys="gby_operation_district"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="Дата регистрации:"
              value={state.given_at}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.given_at}
              boundKeys="given_at"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="Дата начала эксплуатации:"
              value={state.exploitation_date_start}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.exploitation_date_start}
              boundKeys="exploitation_date_start"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="tech_inspection_passed_id"
              type="select"
              label="Технический осмотр пройден"
              value={state.data.tech_inspection_passed}
              onChange={handleChangeDataOptions}
              options={ get(inspectionConfig, 'tech_inspection_passed', [])}
              error={errors.data.tech_inspection_passed}
              boundKeys={'tech_inspection_passed'}
              clearable={false}
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="glonass_stationary_id"
              type="select"
              label="ГЛОНАСС стационарный"
              value={state.data.glonass_stationary}
              onChange={handleChangeDataOptions}
              options={ get(inspectionConfig, 'glonass_stationary', [])}
              error={errors.data.glonass_stationary}
              clearable={false}
              disabled={!props.isPermitted}
              boundKeys={'glonass_stationary'}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="glonass_registered_id"
              type="select"
              label="ГЛОНАСС зарегистрирован"
              value={state.data.glonass_registered}
              onChange={handleChangeDataOptions}
              options={ get(inspectionConfig, 'glonass_registered', [])}
              error={errors.data.glonass_registered}
              clearable={false}
              disabled={!props.isPermitted}
              boundKeys={'glonass_registered'}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="logo_id"
              type="select"
              label="Логотип"
              value={state.data.logo}
              onChange={handleChangeDataOptions}
              options={ get(inspectionConfig, 'logo', [])}
              error={errors.data.logo}
              clearable={false}
              disabled={!props.isPermitted}
              boundKeys={'logo'}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="state_exploitation"
              type="select"
              label="Состояние эксплуатации:"
              clearable={false}
              value={state.state_exploitation}
              error={errors.state_exploitation}
              options={stateExploitationOptions}
              onChange={props.handleChange}
              boundKeys="state_exploitation"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="tech_condition_id"
              type="select"
              label="Техническое состояние"
              value={state.data.tech_condition}
              onChange={handleChangeDataOptions}
              options={ get(inspectionConfig, 'tech_condition', [])}
              error={errors.data.tech_condition}
              clearable={false}
              disabled={!props.isPermitted}
              boundKeys={'tech_condition'}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <AdditionalInfoWrapper>
              <EtsBootstrap.Button onClick={handleChangeDefectShow}>
                {
                  defectShow
                    ? <EtsBootstrap.Glyphicon glyph="minus" />
                    : <EtsBootstrap.Glyphicon glyph="plus" />
                }
                Указать дефекты
              </EtsBootstrap.Button>
              {
                defectShow &&
                  <AdditionalInfoBlock>
                    <EtsBootstrap.Row>
                      <EtsBootstrap.Col md={6}>
                        <h5>Выявленные дефекты ТС при внешнем осмотре:</h5>
                        <IAVisibleWarningContainer
                          onChange={handleChangeDataForIA}
                          data={state.data}
                          errors={errors.data}
                          isPermitted={props.isPermitted}
                          filedToCheck={filedToCheckDefectDataOuter}
                        />
                      </EtsBootstrap.Col>
                      <EtsBootstrap.Col md={6}>
                        <h5>Выявленные дефекты при пробном пуске ТС:</h5>
                        <IAVisibleWarningContainer
                          onChange={handleChangeDataForIA}
                          data={state.data}
                          errors={errors.data}
                          isPermitted={props.isPermitted}
                          filedToCheck={filedToCheckDefectDataFirstStart}
                        />
                      </EtsBootstrap.Col>
                    </EtsBootstrap.Row>
                  </AdditionalInfoBlock>
              }
            </AdditionalInfoWrapper>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  id="fact_status"
                  type="select"
                  label="Фактический статус ТС:"
                  clearable={false}
                  value={state.fact_status}
                  error={errors.fact_status}
                  options={factStatusOptions}
                  onChange={props.handleChange}
                  boundKeys="fact_status"
                  disabled={!props.isPermitted}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  id="status_at_check"
                  type="select"
                  label="Нахождение ТС на момент проверки:"
                  clearable={false}
                  value={state.status_at_check}
                  error={errors.status_at_check}
                  options={statusAtCheckOptions}
                  onChange={props.handleChange}
                  boundKeys="status_at_check"
                  disabled={!props.isPermitted}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <FieldCarsConditionsCarSelectFactStatus
              formState={state}
              formErrors={errors}
              handleChange={props.handleChange}
              isPermitted={props.isPermitted}
            />
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  id="mileage"
                  type="number"
                  label="Пробег на дату проведения проверки:"
                  value={state.mileage}
                  error={errors.mileage}
                  onChange={props.handleChange}
                  boundKeys="mileage"
                  disabled={!props.isPermitted}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={6}>
                <ExtField
                  id="motohours"
                  type="number"
                  label="Наработка м/ч на дату проведения проверки:"
                  value={state.motohours}
                  error={errors.motohours}
                  onChange={props.handleChange}
                  boundKeys="motohours"
                  disabled={!props.isPermitted}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <HrDelimiter></HrDelimiter>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h4>
              Ремонт/ТО
            </h4>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="Дата прохождения последнего ТО шасси:"
              value={state.last_tech_inspection_date}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.last_tech_inspection_date}
              boundKeys="last_tech_inspection_date"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="Дата прохождения последнего ТО спецоборудования:"
              value={state.last_inspection_equipment}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.last_inspection_equipment}
              boundKeys="last_inspection_equipment"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Пробег на дату проведения последнего ТО:"
                value={state.odometr_fact}
                onChange={props.handleChange}
                error={errors.odometr_fact}
                boundKeys="odometr_fact"
                disabled={!props.isPermitted}
                inline
              />
            </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Наработка м/ч на дату проведения последнего ТО:"
                value={state.motohours_fact}
                onChange={props.handleChange}
                error={errors.motohours_fact}
                boundKeys="motohours_fact"
                disabled={!props.isPermitted}
                inline
              />
            </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <IAVisibleWarningContainer
              onChange={handleChangeDataForIA}
              data={state.data}
              errors={errors.data}
              isPermitted={props.isPermitted}
              filedToCheck={filedToCheckDefectDataOtherFirst}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="boolean"
              label="ТО проведено собственными силами:"
              value={state.self_tm_repair}
              onChange={props.handleChangeBoolean}
              boundKeys="self_tm_repair"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Кем проведено последнее ТО (организация):"
              value={state.last_tm_repair_company}
              onChange={props.handleChange}
              error={errors.last_tm_repair_company}
              boundKeys="last_tm_repair_company"
              disabled={!props.isPermitted}
              inline
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="Дата проведения последнего ремонта:"
              value={state.last_repair}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.last_repair}
              boundKeys="last_repair"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Кем проведен последний ремонт (организация):"
              value={state.last_repair_company}
              onChange={props.handleChange}
              error={errors.last_repair_company}
              boundKeys="last_repair_company"
              disabled={!props.isPermitted}
              inline
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="repair_application_id"
              type="select"
              label="Заявка на ремонт"
              value={state.data.repair_application}
              onChange={handleChangeDataOptions}
              options={ get(inspectionConfig, 'repair_application', [])}
              error={errors.data.repair_application}
              clearable={false}
              disabled={!props.isPermitted}
              boundKeys={'repair_application'}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="В ремонте с даты:"
              value={state.data.repair_from_date}
              makeGoodFormat
              onChange={handleChangeData}
              error={errors.data.repair_from_date}
              boundKeys="repair_from_date"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              id="repair_reason_id"
              type="select"
              label="Причина ремонта"
              value={state.data.repair_reason}
              onChange={handleChangeDataOptions}
              options={ get(inspectionConfig, 'repair_reason', [])}
              error={errors.data.repair_reason}
              clearable={false}
              disabled={!props.isPermitted}
              boundKeys={'repair_reason'}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        {/* { DITETS-6089 попросили просто скрыть
          !IS_CREATING && state.updated_at
            ? (
              <p>ТС проверено {makeDate(state.updated_at)} в {makeTime(state.updated_at)}</p>
            )
            : (
              <DivNone />
            )
        } */}
      </React.Fragment>
    );
  },
);

export default BlockCarInfoMainData;
