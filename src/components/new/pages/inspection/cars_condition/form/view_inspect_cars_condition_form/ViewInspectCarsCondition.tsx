import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { ReduxState } from 'redux-main/@types/state';
import { InspectCarsCondition, CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { INSPECT_TYPE_FORM } from '../../../autobase/global_constants';
import { ContainerForm, FooterForm, TitleForm } from '../../../common_components/form_wrap_check/styled';
import { FooterEnd } from 'global-styled/global-styled';
import ViewInspectCarsConditionButtonSubmit from './button_submit/ViewInspectCarsConditionButtonSubmit';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PropsViewInspectCarsConditionWithForm, ViewInspectCarsConditionStateProps, ViewInspectCarsConditionDispatchProps, ViewInspectCarsConditionOwnProps, ViewInspectCarsConditionProps } from './@types/ViewInspectCarsContidion';
import { getDefaultInspectCarsConditionElement } from './utils';
import inspectCarsConditionPermissions from '../../_config_data/permissions';
import { inspectcarsConditionormSchema } from './schema';
import BlockCarSConditionInfo from './blocks/info/BlockCarSConditionInfo';
import BlockCarSConditionPrepareCarToInspect from './blocks/prepare_car_to_inspect/BlockCarSConditionPrepareCarToInspect';
import BlockCarsConditionSelectCar from './blocks/select_car/BlockCarSConditionSelectCar';
import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import BlockCarsConditionHeadCountList from './blocks/headcount/BlockCarsConditionHeadCountList';
import BlockCarsConditionCarsUse from './blocks/car_use/BlockCarsConditionCarsUse';
import BlockInfoCard from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/BlockInfoCard';
import { ColScroll } from './styled';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import BlockCarsConditionSetInspectEmployee from './blocks/set_inspect_employee/BlockCarsConditionSetInspectEmployee';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { get } from 'lodash';
import { DataTableInputOutputListErrors, isValidDataTableInput } from 'components/old/ui/table/utils';
import * as TypesCars from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-cars';
import * as TypesHarvestingUnit from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-agregat';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { isNullOrUndefined } from 'util';

const ViewInspectCarsCondition: React.FC<ViewInspectCarsConditionProps> = React.memo(
  (props) => {
    const [carsConditionCarsList, setCarsConditionCarsList] = React.useState<Array<CarsConditionCars>>([]);
    const [preparePlanCanSave, setPreparePlanCanSave] = React.useState(false);
    const [awaitCarsCnt, setAwaitCarsCnt] = React.useState(0);
    const [prevSearchState, setPrevSearchState] = React.useState(props.searchState);
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = props;

    const isHasPeriod = Boolean(state.checks_period); // разное отображение по типу проверки

    const isPermittedChangeCloseParams = (
      props.isPermittedToUpdateClose
      && props.type === INSPECT_TYPE_FORM.closed
    );

    const isPermittedChangeListParams = (
      props.isPermitted
      && props.type === INSPECT_TYPE_FORM.list
      || isPermittedChangeCloseParams
    );

    // разное отображение по типу проверки
    const isActiveInspect = (
      props.type === INSPECT_TYPE_FORM.list
      || isPermittedChangeCloseParams
    );

    const canSavePreparePlanHandler = React.useCallback(
      (preparePlanCanSaveNew: boolean) => {
        setPreparePlanCanSave(preparePlanCanSaveNew);
      },
      [preparePlanCanSave, props.canSave, isHasPeriod],
    );

    // Вызов колбека при закрытии формы заполнения
    React.useEffect(() => {
      if (!isNullOrUndefined(prevSearchState.inspectId) && !get(props, 'searchState.inspectId')) {
        callBackToLoadCars();
      }
      setPrevSearchState(props.searchState);
    }, [props.searchState, props.match.params, props.setDataInSearch, props.setParams]);

    const callBackToLoadCars = React.useCallback(
      () => {
        const loadData = async () => {
          try {
            const result = await props.autobaseGetCarsConditionCars(state.id, { page, path });
            setCarsConditionCarsList(result);
            const checked_cars_cnt = result.reduce((summ, { was_resaved }) => summ + Number(was_resaved), 0);
            setAwaitCarsCnt(result.length - checked_cars_cnt);
            if (state.checked_cars_cnt !== checked_cars_cnt) { // что бы небыло изменения в formState DITETS-7050
              props.handleChange({
                checked_cars_cnt,
              });
            }
          } catch (error) {
            console.error(error);
          }
        };

        setCarsConditionCarsList([]);
        return loadData();
      },
      [state.id],
    );

    React.useEffect(
      () => {
        if (!isHasPeriod) {
          canSavePreparePlanHandler(true);
        } else {
          // т.к. компонент не рендерится, а валидация происходит в prepareCars
          const types_cars = get(props, 'element.data.types_cars');
          const types_harvesting_unit = get(props, 'element.data.types_harvesting_unit');

          const outputListErrorsTypesCars = DataTableInputOutputListErrors(types_cars, [], TypesCars.validationSchema);
          const isValidInputTypesCars = isValidDataTableInput(outputListErrorsTypesCars);
          const outputListErrorsTypesHarvestingUnit = DataTableInputOutputListErrors(types_harvesting_unit, [], TypesHarvestingUnit.validationSchema);
          const isValidInputTypesHarvestingUnit = isValidDataTableInput(outputListErrorsTypesHarvestingUnit);

          canSavePreparePlanHandler(isValidInputTypesCars && isValidInputTypesHarvestingUnit);
        }
      },
      [isHasPeriod, preparePlanCanSave],
    );

    React.useEffect(
      () => {
        callBackToLoadCars();
      },
      [],
    );

    const handleChangeData = React.useCallback(
      (ownObj: Partial<InspectCarsCondition['data']>) => {
        props.handleChange({
          data: {
            ...state.data,
            ...ownObj,
          },
        });
      },
      [state.data],
    );

    const handleSubmit = React.useCallback(
      async (action) => {
        await props.handleChange({
          action: action ? action : 'save',
        });
        props.defaultSubmit();
      },
      [props.handleChange, props.defaultSubmit, state.action],
    );

    return (
      <React.Fragment>
        <TitleForm md={12} sm={12}>
          <h4>{props.title}</h4>
          <EtsBootstrap.Button onClick={props.hideWithoutChanges}>
            <EtsBootstrap.Glyphicon glyph="remove" />
          </EtsBootstrap.Button>
        </TitleForm>
        <ContainerForm>
          <ColScroll md={6} sm={6}>
            <BlockCarSConditionInfo
              head_balance_holder_base={state.head_balance_holder_base}
              head_operating_base={state.head_operating_base}

              error_head_balance_holder_base={errors.head_balance_holder_base}
              error_head_operating_base={errors.head_operating_base}

              isPermitted={isPermittedChangeListParams}
              isActiveInspect={isActiveInspect}
              company_short_name={state.company_short_name}
              monitoring_kind_text={state.monitoring_kind_text}
              checks_type_text={state.checks_type_text}
              checks_period_text={state.checks_period_text}
              onChange={props.handleChange}
            />
            {
              isHasPeriod
                ? (
                  <BlockCarSConditionPrepareCarToInspect
                    preparing_cars_check={state.data.preparing_cars_check}
                    error_preparing_cars_check={errors.data.preparing_cars_check}
                    onChange={handleChangeData}
                    isPermitted={isPermittedChangeListParams}
                    isActiveInspect={isActiveInspect}
                  />
                )
                : (
                  <React.Fragment>
                    <BlockCarsConditionHeadCountList
                      headcount={state.data.headcount}
                      error_headcount={errors.data.headcount}

                      isPermitted={isPermittedChangeListParams}
                      isActiveInspect={isActiveInspect}

                      onChange={handleChangeData}
                    />
                    <BlockCarsConditionCarsUse
                      cars_use={state.data.cars_use}
                      carsConditionCarsList={carsConditionCarsList}
                      error_cars_use={errors.data.cars_use}

                      isPermitted={isPermittedChangeListParams}
                      isActiveInspect={isActiveInspect}
                      onChange={handleChangeData}
                    />
                  </React.Fragment>
                )
            }
            <BlockCarsConditionSelectCar
              isPermitted={isPermittedChangeListParams}
              isActiveInspect={isActiveInspect}
              carsConditionCarsList={carsConditionCarsList}
              awaitCarsCnt={awaitCarsCnt}
              checked_cars_cnt={state.checked_cars_cnt}
              error_checked_cars_cnt={errors.checked_cars_cnt}
              loadingPage={props.loadingPage}
              monitoring_kind={state.monitoring_kind}
            />
            <BlockCarsConditionSetInspectEmployee
              type={props.type}
              isPermittedChangeListParams={isPermittedChangeListParams}
              isPermittedListPhotosOfSupportingDocuments={isPermittedChangeListParams}
              isPermittedListPhotosDefect={false}

              commission_members={state.commission_members}
              company_id={state.company_id}
              error_agents_from_gbu={errors.agents_from_gbu}
              error_commission_members={errors.commission_members}

              agents_from_gbu={state.agents_from_gbu}
              company_short_name={state.company_short_name}
              resolve_to={state.resolve_to}
              files={state.files}

              error_resolve_to={errors.resolve_to}
              handleChange={props.handleChange}
              page={props.page}
              path={props.path}
            />
          </ColScroll>
          <ColScroll md={6} sm={6}>
            <BlockInfoCard
              isHasPeriod={isHasPeriod}
              carsConditionCarsList={carsConditionCarsList}
              callBackToLoadCars={callBackToLoadCars}

              types_cars={state.data.types_cars}
              types_harvesting_unit={state.data.types_harvesting_unit}
              canSavePreparePlanHandler={canSavePreparePlanHandler}
              handleChangeData={handleChangeData}
              isPermitted={isPermittedChangeListParams}

              page={props.page}
              type={props.type}
            />
          </ColScroll>
        </ContainerForm>
        <FooterForm md={12} sm={12}>
          <FooterEnd>
            <ViewInspectCarsConditionButtonSubmit
              type={props.type}
              handleSubmit={handleSubmit}
              isPermittedToUpdateClose={props.isPermittedToUpdateClose}
              handleHide={props.handleHide}
              selectedInspectCarsCondition={state}
              canSave={props.canSave && preparePlanCanSave}
              loadingPage={props.loadingPage}

              id={state.id}
              registryPage={props.page}
            />
            <EtsBootstrap.Button onClick={props.hideWithoutChanges}>{props.type !== INSPECT_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</EtsBootstrap.Button>
          </FooterEnd>
        </FooterForm>
      </React.Fragment>
    );
  },
);

export default compose<ViewInspectCarsConditionProps, ViewInspectCarsConditionOwnProps>(
  connect<ViewInspectCarsConditionStateProps, ViewInspectCarsConditionDispatchProps, ViewInspectCarsConditionOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      autobaseGetCarsConditionCars: (...arg) => (
        dispatch(
          inspectionCarsConditionActions.autobaseGetCarsConditionCars(...arg),
        )
      ),
    }),
  ),
  withSearch,
  withForm<PropsViewInspectCarsConditionWithForm, InspectCarsCondition>({
    uniqField: 'id',
    updateAction: inspectionCarsConditionActions.actionUpdateInspectCarsCondition,
    withThrow: true,
    mergeElement: (props) => {
      return getDefaultInspectCarsConditionElement(props.element);
    },
    permissions: inspectCarsConditionPermissions,
    schema: inspectcarsConditionormSchema,
    askBeforeCloseIfChanged: {},
  }),
  withPreloader({
    typePreloader: 'mainpage',
  }),
)(ViewInspectCarsCondition);
