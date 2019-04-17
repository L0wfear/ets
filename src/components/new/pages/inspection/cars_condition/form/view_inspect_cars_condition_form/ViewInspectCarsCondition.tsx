import * as React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { InspectCarsCondition, CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { INSPECT_AUTOBASE_TYPE_FORM } from '../../../autobase/global_constants';
import { Button } from 'react-bootstrap';
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
import { ColScroll } from './styled';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

const ViewInspectCarsCondition: React.FC<ViewInspectCarsConditionProps> = React.memo(
  (props) => {
    const [carsConditionCarsList, setCarsConditionCarsList] = React.useState<CarsConditionCars[]>([]);
    const [preparePlanCanSave, setPreparePlanCanSave] = React.useState(false);
    const [prepareList, setPrepareList] = React.useState([]);

    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      isPermitted,
    } = props;

    const isHasPeriod = Boolean(state.checks_period); // разное отображение по типу проверки
    const isActiveInspect = props.type === INSPECT_AUTOBASE_TYPE_FORM.list; // разное отображение по типу проверки

    const callBackToLoadCars = React.useCallback(
      () => {
        setCarsConditionCarsList([]);
        props.autobaseGetCarsConditionCars(state.id, { page, path }).then(
          (result) => (
            setCarsConditionCarsList(result)
          ),
        ).catch((error) => {
          console.error(error); //tslint:disable-line
        });
      },
      [state.id],
    );

    React.useEffect(
      () => {
        if (isHasPeriod) {
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

    const handleCloseWithLoadregistry = React.useCallback(
      () => {
        props.handleHide(
          props.type !== INSPECT_AUTOBASE_TYPE_FORM.closed,
        );
      },
      [props.handleHide, props.type],
    );

    // tslint:disable-next-line:no-console
    console.log('ViewInspectCarsCondition === ', {props, preparePlanCanSave, prepareList});
    return (
      <React.Fragment>
        <ContainerForm>
          <ColScroll md={6} sm={6}>
            <BlockCarSConditionInfo
              head_balance_holder_base={state.head_balance_holder_base}
              head_operating_base={state.head_operating_base}

              error_head_balance_holder_base={errors.head_balance_holder_base}
              error_head_operating_base={errors.head_operating_base}

              isPermitted={isPermitted}
              isActiveInspect={isActiveInspect}
              company_name={state.company_name}
              monitoring_kind_text={state.monitoring_kind_text}
              checks_type_text={state.checks_type_text}
              checks_period_text={state.checks_period_text}
              onChange={props.handleChange}
            />
            {
              isHasPeriod
                ? (
                  <BlockCarSConditionPrepareCarToInspect
                    preparing_cars_check={state.preparing_cars_check}
                    error_preparing_cars_check={errors.preparing_cars_check}
                    onChange={props.handleChange}
                    isPermitted={isPermitted}
                    isActiveInspect={isActiveInspect}
                  />
                )
                : (
                  <React.Fragment>
                    <BlockCarsConditionHeadCountList
                      headcount_list={state.headcount_list}
                      error_headcount_list={errors.headcount_list}

                      isPermitted={isPermitted}
                      isActiveInspect={isActiveInspect}

                      onChange={props.handleChange}
                    />
                    <BlockCarsConditionCarsUse
                      headcount_list={state.headcount_list}
                      carsConditionCarsList={carsConditionCarsList}
                      error_cars_use={errors.headcount_list.cars_use}

                      isPermitted={isPermitted}
                      isActiveInspect={isActiveInspect}
                      onChange={props.handleChange}
                    />
                  </React.Fragment>
                )
            }
            <BlockCarsConditionSelectCar
              isPermitted={isPermitted}
              isActiveInspect={isActiveInspect}
              carsConditionCarsList={carsConditionCarsList}
            />
            <BlockCarsConditionSelectPhotosOfSupportingDocuments
              files={state.files}
              isPermitted={isPermitted}
              isActiveInspect={isActiveInspect}
              onChange={props.handleChange}
            />
          </ColScroll>
          <ColScroll md={6} sm={6}>
            <BlockInfoCard
              isHasPeriod={isHasPeriod}
              carsConditionCarsList={carsConditionCarsList}
              callBackToLoadCars={callBackToLoadCars}
              types_cars={state.data.types_cars}
              canSavePreparePlanHandler={setPreparePlanCanSave}
              prepareListHandler={setPrepareList}
              page={props.page}
              type={props.type}
            />
          </ColScroll>
        </ContainerForm>
        <FooterForm md={12} sm={12}>
          <FooterEnd>
            <ViewInspectCarsConditionButtonSubmit
              type={props.type}
              handleHide={props.handleHide}
              selectedInspectCarsCondition={state}
              canSave={props.canSave && preparePlanCanSave}
              loadingPage={props.loadingPage}
            />
            <Button onClick={handleCloseWithLoadregistry}>{props.type !== INSPECT_AUTOBASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</Button>
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
)(ViewInspectCarsCondition);
