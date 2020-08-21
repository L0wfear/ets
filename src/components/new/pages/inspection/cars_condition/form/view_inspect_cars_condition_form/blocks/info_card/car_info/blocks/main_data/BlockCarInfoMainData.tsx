import * as React from 'react';
import { BlockCarInfoProps } from '../../@types/BlockCarInfo';
import ExtField from 'components/@next/@ui/renderFields/Field';
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
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import useCountryOptions from 'components/new/utils/hooks/services/useOptions/useCountryOptions';
import { get } from 'lodash';
import { stateExploitationOptions, factStatusOptions, statusAtCheckOptions } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/options';
import IAVisibleWarningContainer from 'components/new/pages/inspection/container/filed_to_check/IAVisibleWarningContainer';
import { filedToCheckDefectDataOuter, filedToCheckDefectDataFirstStart, filedToCheckDefectDataOtherFirst, filedToCheckDefectDataDocs, } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/filedToCheckCarInfoMainCheckData';
import FieldCarsConditionsCarSelectFactStatus from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/fact_status_and_other/FieldCarsConditionsCarSelectFactStatus';
import { HrDelimiter } from 'global-styled/global-styled';
import { actionInspectionConfigGetAndSetInStore } from 'redux-main/reducers/modules/some_uniq/inspection_config/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import useAutobaseEngineTypeOptions from 'components/new/utils/hooks/services/useOptions/useAutobaseEngineTypeOptions';

type BlockCarInfoMainDataProps = (
  {
    isPermitted: boolean;
    handleChangeBoolean: FormWithHandleChangeBoolean<CarsConditionCars>;
  }
) & Pick<BlockCarInfoProps, 'IS_CREATING' | 'formState' | 'formErrors' | 'handleChange' | 'page' | 'path' | 'isCustomUserCard'>;

const BlockCarInfoMainData: React.FC<BlockCarInfoMainDataProps> = React.memo(
  (props) => {
    const {
      IS_CREATING,
      isCustomUserCard,
      formState: state,
      formErrors: errors,
    } = props;

    const [defectShow, SetDefectShow] = React.useState(false);
    const [inspectionConfigOptions, setInspectionConfigOptions] = React.useState(null);
    const countryOptionData = useCountryOptions(props.page, props.path, 'short_name');
    const engineTypeOptionData = useAutobaseEngineTypeOptions(props.page, props.path, 'name');
    const dispatch = etsUseDispatch();
    const inspectionConfig = etsUseSelector((reduxState) => get( getSomeUniqState(reduxState), `inspectionConfig`, null));

    React.useEffect( () => {
      if (inspectionConfig) {
        setInspectionConfigOptions(inspectionConfig);
      }
    }, [inspectionConfig]);

    const handleChangeDefectShow = React.useCallback(
      () => {
        SetDefectShow(!defectShow);
      },
      [SetDefectShow, defectShow],
    );

    React.useEffect(() => {
      dispatch(actionInspectionConfigGetAndSetInStore({ page: '', path: '' }));
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
      [state.data, props.handleChange, inspectionConfigOptions],
    );

    const handleChangeDataBoolean = React.useCallback(
      (key) => {
        props.handleChange({
          data: {
            ...state.data,
            [key]: !state.data[key],
          },
        });
      },
      [state.data, props.handleChange, inspectionConfigOptions],
    );

    // const handleChangeData = React.useCallback(
    //   (key, event) => {
    //     props.handleChange({
    //       data: {
    //         ...state.data,
    //         [key]: get(event, 'target.value', event),
    //       },
    //     });
    //   },
    //   [state.data, props.handleChange, inspectionConfigOptions],
    // );

    const handleChangeDataOptions = React.useCallback(
      (key, event) => {
        props.handleChange({
          data: {
            ...state.data,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [state.data, props.handleChange, inspectionConfigOptions],
    );

    return (
      <React.Fragment>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={!IS_CREATING && !isCustomUserCard ? 6 : 12}>
            <ExtField
              id="gov_number"
              type="string"
              label="Гос. номер:"
              value={state.gov_number}
              readOnly={!IS_CREATING && !isCustomUserCard}
              onChange={props.handleChange}
              error={errors.gov_number}
              boundKeys="gov_number"
              disabled={!props.isPermitted}
              inline
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={!IS_CREATING && !isCustomUserCard ? 6 : 12}>
            {
              !IS_CREATING && !isCustomUserCard
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
          <EtsBootstrap.Col md={!IS_CREATING && !isCustomUserCard ? 6 : 12}>
            {
              !IS_CREATING && !isCustomUserCard
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
          <EtsBootstrap.Col md={!IS_CREATING && !isCustomUserCard ? 6 : 12}>
            {
              !IS_CREATING && !isCustomUserCard
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
          <EtsBootstrap.Col md={!IS_CREATING && !isCustomUserCard ? 6 : 12}>
            {
              !IS_CREATING && !isCustomUserCard
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
          {
            !isCustomUserCard
              && <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="VIN (из системы):"
                  value={state.vin}
                  onChange={props.handleChange}
                  error={errors.vin}
                  boundKeys="vin"
                  disabled={!props.isPermitted}
                  readOnly={!IS_CREATING && !isCustomUserCard}
                />
              </EtsBootstrap.Col>
          }
          {
            !isCustomUserCard
              && <EtsBootstrap.Col md={6}>
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
          }
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="string"
              label="VIN (ручной ввод):"
              value={state.vin_by_hand}
              onChange={props.handleChange}
              error={errors.vin_by_hand}
              boundKeys="vin_by_hand"
              disabled={!props.isPermitted}
              hidden={!state.vin_incorrect && !isCustomUserCard }
            />
          </EtsBootstrap.Col>
          {
            !isCustomUserCard
              && <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="Заводской номер (из системы):"
                  value={state.factory_number}
                  onChange={props.handleChange}
                  error={errors.factory_number}
                  boundKeys="factory_number"
                  disabled={!props.isPermitted}
                  readOnly={!IS_CREATING && !isCustomUserCard}
                />
              </EtsBootstrap.Col>
          }
          {
            !isCustomUserCard
              && <EtsBootstrap.Col md={6}>
                <ExtField
                  type="boolean"
                  label="Некорректный заводской номер:"
                  value={state.factory_number_incorrect}
                  onChange={props.handleChangeBoolean}
                  error={errors.factory_number_incorrect}
                  boundKeys="factory_number_incorrect"
                  disabled={!props.isPermitted}
                  hidden={IS_CREATING && isCustomUserCard}
                />
              </EtsBootstrap.Col>
          }
          <EtsBootstrap.Col md={12}>
            <ExtField
              type="string"
              label="Заводской номер (ручной ввод):"
              value={state.factory_number_by_hand}
              onChange={props.handleChange}
              error={errors.factory_number_by_hand}
              boundKeys="factory_number_by_hand"
              disabled={!props.isPermitted}
              hidden={!state.factory_number_incorrect && !isCustomUserCard}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={12}>
                <h4>
                  Дополнительная информация
                </h4>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
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
                  options={ get(inspectionConfigOptions, 'environmental_class', [])}
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
                  options={engineTypeOptionData.options}
                  etsIsLoading={engineTypeOptionData.isLoading}
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
                  options={ get(inspectionConfigOptions, 'classifier', []) }
                  error={errors.data.classifier}
                  clearable={false}
                  disabled={!props.isPermitted}
                  boundKeys={'classifier'}
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
                  options={ get(inspectionConfigOptions, 'kind', []) }
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
                  options={ get(inspectionConfigOptions, 'kind_purchase', []) }
                  error={errors.kind_purchase}
                  clearable={false}
                  disabled={!props.isPermitted}
                  boundKeys={'kind_purchase'}
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <HrDelimiter />
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
              makeGoodFormatInitial
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
              onChange={handleChangeDataBoolean}
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
              makeGoodFormatInitial
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
              label="Техника относится к ГБУ Жилищник:"
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
              label="Техника эксплуатируется жилищником:"
              value={state.gby_operation_district}
              onChange={props.handleChange}
              error={errors.gby_operation_district}
              boundKeys="gby_operation_district"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <HrDelimiter />
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h4>
              Общая информация
            </h4>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="Дата регистрации:"
              value={state.registration_date}
              makeGoodFormat
              makeGoodFormatInitial
              onChange={props.handleChange}
              error={errors.registration_date}
              boundKeys="registration_date"
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
              makeGoodFormatInitial
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
              options={ get(inspectionConfigOptions, 'tech_inspection_passed', [])}
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
              options={ get(inspectionConfigOptions, 'glonass_stationary', [])}
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
              options={ get(inspectionConfigOptions, 'glonass_registered', [])}
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
              options={ get(inspectionConfigOptions, 'logo', [])}
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
              options={ get(inspectionConfigOptions, 'tech_condition', [])}
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
                {
                  props.isPermitted
                    ? 'Указать дефекты'
                    : 'Посмотреть дефекты'
                }
              </EtsBootstrap.Button>
              {
                defectShow
                  && <AdditionalInfoBlock>
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
                    <EtsBootstrap.Row>
                      <EtsBootstrap.Col md={6}>
                        <h4>Проверка документации</h4>
                        <IAVisibleWarningContainer
                          onChange={handleChangeDataForIA}
                          data={state.data}
                          errors={errors.data}
                          isPermitted={props.isPermitted}
                          filedToCheck={filedToCheckDefectDataDocs}
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
              <EtsBootstrap.Col md={6} mdOffset={6}>
                <ExtField
                  id="on_base"
                  type="boolean"
                  label="ТС находится на базе"
                  value={state.on_base}
                  error={errors.on_base}
                  onChange={props.handleChangeBoolean}
                  boundKeys="on_base"
                  className="checkbox-input flex-reverse"
                  disabled={!props.isPermitted || state.status_at_check !== 'on_line'}
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
        <HrDelimiter />
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
              makeGoodFormatInitial
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
              makeGoodFormatInitial
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
              value={state.data.own_tech_maintenance}
              onChange={handleChangeDataBoolean}
              boundKeys="own_tech_maintenance"
              disabled={!props.isPermitted}
              className={'checkbox-input flex-reverse'}
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
              value={state.last_repair_date}
              makeGoodFormat
              makeGoodFormatInitial
              onChange={props.handleChange}
              error={errors.last_repair_date}
              boundKeys="last_repair_date"
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
              options={ get(inspectionConfigOptions, 'repair_application', [])}
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
              value={state.repair_from_date}
              makeGoodFormat
              makeGoodFormatInitial
              onChange={props.handleChange}
              error={errors.repair_from_date}
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
              options={ get(inspectionConfigOptions, 'repair_reason', [])}
              error={errors.data.repair_reason}
              clearable={false}
              disabled={!props.isPermitted}
              boundKeys={'repair_reason'}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="boolean"
              label="Тех. обслуживание, ремонт не произведены"
              value={state.data.not_maintenance_and_repair}
              onChange={handleChangeDataBoolean}
              boundKeys="not_maintenance_and_repair"
              disabled={!props.isPermitted}
              className={'checkbox-input flex-reverse'}
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
