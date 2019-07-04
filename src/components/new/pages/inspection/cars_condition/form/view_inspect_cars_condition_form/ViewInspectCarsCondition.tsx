import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { InspectCarsCondition, CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { INSPECT_AUTOBASE_TYPE_FORM } from '../../../autobase/global_constants';

import { ContainerForm, FooterForm } from '../../../common_components/form_wrap_check/styled';
import { FooterEnd } from 'global-styled/global-styled';
import ViewInspectCarsConditionButtonSubmit from './button_submit/ViewInspectCarsConditionButtonSubmit';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { PropsViewInspectCarsConditionWithForm, ViewInspectCarsConditionStateProps, ViewInspectCarsConditionDispatchProps, ViewInspectCarsConditionOwnProps, ViewInspectCarsConditionProps } from './@types/ViewInspectCarsContidion';
import { getDefaultInspectCarsConditionElement } from './utils';
import inspectCarsConditionPermissions from '../../_config_data/permissions';
import { inspectcarsConditionormSchema } from './schema';
import BlockCarSConditionInfo from './blocks/info/BlockCarSConditionInfo';
import BlockCarSConditionPrepareCarToInspect from './blocks/prepare_car_to_inspect/BlockCarSConditionPrepareCarToInspect';
import BlockCarsConditionSelectCar from './blocks/select_car/BlockCarSConditionSelectCar';
import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import BlockCarsConditionSelectPhotosOfSupportingDocuments from './blocks/photos_of_supporting_documents/BlockCarsConditionSelectPhotosOfSupportingDocuments';
import BlockCarsConditionHeadCountList from './blocks/headcount_list/BlockCarsConditionHeadCountList';
import BlockCarsConditionCarsUse from './blocks/car_use/BlockCarsConditionCarsUse';
import BlockInfoCard from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/BlockInfoCard';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import BlockCarsConditionSetInspectEmployee from './blocks/set_inspect_employee/BlockCarsConditionSetInspectEmployee';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { INSPECT_PGM_BASE_TYPE_FORM } from '../../../pgm_base/global_constants';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const ViewInspectCarsCondition: React.FC<ViewInspectCarsConditionProps> = React.memo(
  (props) => {
    const [carsConditionCarsList, setCarsConditionCarsList] = React.useState<CarsConditionCars[]>([]);
    const [preparePlanCanSave, setPreparePlanCanSave] = React.useState(true);
    const typeRightView = props.match.params.typeRightView;

    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = props;

    const isHasPeriod = Boolean(state.checks_period); // разное отображение по типу проверки

    const isPermittedChangeListParams = (
      props.isPermitted
      && props.type === INSPECT_PGM_BASE_TYPE_FORM.list
      || (
        props.isPermittedToUpdateClose
        && props.type === INSPECT_PGM_BASE_TYPE_FORM.closed
      )
    );

    const isPermittedChangeCloseParams = (
      props.isPermitted
      && props.type === INSPECT_PGM_BASE_TYPE_FORM.close
      || (
        props.isPermittedToUpdateClose
        && props.type === INSPECT_PGM_BASE_TYPE_FORM.closed
      )
    );

    // разное отображение по типу проверки
    const isActiveInspect = (
      props.type === INSPECT_AUTOBASE_TYPE_FORM.list
      || (
        props.isPermittedToUpdateClose
        && props.type === INSPECT_PGM_BASE_TYPE_FORM.closed
      )
    );

    const callBackToLoadCars = React.useCallback(
      () => {
        const loadData = async () => {
          try {
            const result = await props.autobaseGetCarsConditionCars(state.id, { page, path });
            setCarsConditionCarsList(result);
            const checked_cars_cnt = result.reduce((summ, { was_resaved }) => summ + Number(was_resaved), 0);
            const cars_cnt = result.length - checked_cars_cnt;
            props.handleChange({
              cars_cnt,
              checked_cars_cnt,
            });
          } catch (error) {
            console.error(error); //tslint:disable-line
          }
        };

        setCarsConditionCarsList([]);
        loadData();
      },
      [state.id],
    );

    React.useEffect(
      () => {
        if (!isHasPeriod) {
          setPreparePlanCanSave(true);
        }
      },
      [isHasPeriod],
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

    return (
      <React.Fragment>
        <ContainerForm>
          <EtsBootstrap.Col md={typeRightView ? 6 : 12} sm={typeRightView ? 6 : 12}>
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
                      headcount_list={state.data.headcount_list}
                      error_headcount_list={errors.data.headcount_list}

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
              cars_cnt={state.cars_cnt}
              checked_cars_cnt={state.checked_cars_cnt}
              error_checked_cars_cnt={errors.checked_cars_cnt}
            />
            <BlockCarsConditionSelectPhotosOfSupportingDocuments
              files={state.files}
              isPermitted={isPermittedChangeListParams}
              isActiveInspect={isActiveInspect}
              onChange={props.handleChange}
            />
            <BlockCarsConditionSetInspectEmployee
              type={props.type}
              isPermittedChangeCloseParams={isPermittedChangeCloseParams}

              close_employee_fio={state.close_employee_fio}
              close_employee_position={state.close_employee_position}
              close_employee_assignment={state.close_employee_assignment}
              close_employee_assignment_date_start={state.close_employee_assignment_date_start}

              commission_members={state.commission_members}
              company_id={state.company_id}
              error_agents_from_gbu={errors.agents_from_gbu}
              agents_from_gbu={state.agents_from_gbu}
              company_short_name={state.company_short_name}
              resolve_to={state.resolve_to}
              error_resolve_to={errors.resolve_to}
              handleChange={props.handleChange}
              page={props.page}
              path={props.path}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={typeRightView ? 6 : 0} sm={typeRightView ? 6 : 0}>
            <BlockInfoCard
              isHasPeriod={isHasPeriod}
              carsConditionCarsList={carsConditionCarsList}
              callBackToLoadCars={callBackToLoadCars}

              types_cars={state.data.types_cars}
              types_harvesting_unit={state.data.types_harvesting_unit}
              canSavePreparePlanHandler={setPreparePlanCanSave}
              handleChangeData={handleChangeData}

              page={props.page}
              type={props.type}
            />
          </EtsBootstrap.Col>
        </ContainerForm>
        <FooterForm md={12} sm={12}>
          <FooterEnd>
            <ViewInspectCarsConditionButtonSubmit
              type={props.type}
              handleSubmit={props.defaultSubmit}
              isPermittedToUpdateClose={props.isPermittedToUpdateClose}
              handleHide={props.handleHide}
              selectedInspectCarsCondition={state}
              canSave={props.canSave && preparePlanCanSave}
              loadingPage={props.loadingPage}
            />
            <EtsBootstrap.Button onClick={props.handleCloseWithoutChanges}>{props.type !== INSPECT_AUTOBASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</EtsBootstrap.Button>
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
  withForm<PropsViewInspectCarsConditionWithForm, InspectCarsCondition>({
    uniqField: 'id',
    updateAction: inspectionCarsConditionActions.actionUpdateInspectCarsCondition,
    withThrow: true,
    mergeElement: (props) => {
      return getDefaultInspectCarsConditionElement(props.element);
    },
    permissions: inspectCarsConditionPermissions,
    schema: inspectcarsConditionormSchema,
  }),
  withPreloader({
    typePreloader: 'mainpage',
    withPagePath: true,
  }),
  withSearch,
)(ViewInspectCarsCondition);
