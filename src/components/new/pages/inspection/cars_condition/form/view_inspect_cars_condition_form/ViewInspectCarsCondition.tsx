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

const ViewInspectCarsCondition: React.FC<ViewInspectCarsConditionProps> = React.memo(
  (props) => {
    const [carsConditionCarsList, setCarsConditionCarsList] = React.useState<CarsConditionCars[]>([]);
    const {
      formState: state,
      page,
      path,
    } = props;

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
        callBackToLoadCars();
      },
      [],
    );

    const isHasPeriod = Boolean(state.checks_period); // разное отображение по типу проверки

    return (
      <React.Fragment>
        <ContainerForm>
          <ColScroll md={6} sm={6}>
            <BlockCarSConditionInfo
              head_balance_holder_base={state.head_balance_holder_base}
              head_operating_base={state.head_operating_base}

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
                    onChange={props.handleChange}
                  />
                )
                : (
                  <React.Fragment>
                    <BlockCarsConditionHeadCountList
                      headcount_list={state.headcount_list}

                      onChange={props.handleChange}
                    />
                    <BlockCarsConditionCarsUse
                      headcount_list={state.headcount_list}
                      carsConditionCarsList={carsConditionCarsList}

                      onChange={props.handleChange}
                    />
                  </React.Fragment>
                )
            }
            <BlockCarsConditionSelectCar
              isActiveInspect={props.type === INSPECT_AUTOBASE_TYPE_FORM.list}
              carsConditionCarsList={carsConditionCarsList}
            />
            <BlockCarsConditionSelectPhotosOfSupportingDocuments
              files={state.files}
              onChange={props.handleChange}
            />
          </ColScroll>
          <ColScroll md={6} sm={6}>
            <BlockInfoCard
              isHasPeriod={isHasPeriod}
              carsConditionCarsList={carsConditionCarsList}
              callBackToLoadCars={callBackToLoadCars}
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
              canSave={props.canSave}
              loadingPage={props.page}
            />
            <Button onClick={props.handleHide}>{props.type !== INSPECT_AUTOBASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</Button>
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
)(ViewInspectCarsCondition);
