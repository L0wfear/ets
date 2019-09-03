import * as React from 'react';
import { compose } from 'recompose';
// import { connect } from 'react-redux';
// import { ReduxState } from 'redux-main/@types/state';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { INSPECT_TYPE_FORM } from '../../../autobase/global_constants';

import { ContainerForm, FooterForm } from '../../../common_components/form_wrap_check/styled';
import { FooterEnd } from 'global-styled/global-styled';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import {
  PropsViewInspectCarsConditionTableWithForm,
  // ViewInspectCarsConditionTableStateProps,
  // ViewInspectCarsConditionTableDispatchProps,
  ViewInspectCarsConditionTableOwnProps,
  ViewInspectCarsConditionTableProps
} from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/@types/ViewInspectCarsConditionTable.h';
import inspectCarsConditionPermissions from '../../_config_data/permissions';
import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const ViewInspectCarsConditionTable: React.FC<ViewInspectCarsConditionTableProps> = React.memo(
  (props) => {

    // const {
    //   formState: state,
    //   formErrors: errors,
    //   page,
    //   path,
    // } = props;

    // const isPermittedChangeCloseParams = (
    //   props.isPermittedToUpdateClose
    //   && props.type === INSPECT_TYPE_FORM.closed
    // );

    // const isPermittedChangeListParams = (
    //   props.isPermitted
    //   && props.type === INSPECT_TYPE_FORM.list
    //   || isPermittedChangeCloseParams
    // );

    // // разное отображение по типу проверки
    // const isActiveInspect = (
    //   props.type === INSPECT_TYPE_FORM.list
    //   || isPermittedChangeCloseParams
    // );

    return (
      <React.Fragment>
        <ContainerForm>
        </ContainerForm>
        <FooterForm md={12} sm={12}>
          <FooterEnd>
            <EtsBootstrap.Button onClick={props.handleCloseWithoutChanges}>{props.type !== INSPECT_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</EtsBootstrap.Button>
          </FooterEnd>
        </FooterForm>
      </React.Fragment>
    );
  },
);

export default compose<ViewInspectCarsConditionTableProps, ViewInspectCarsConditionTableOwnProps>(
  // connect<ViewInspectCarsConditionTableStateProps, ViewInspectCarsConditionTableDispatchProps, ViewInspectCarsConditionTableOwnProps, ReduxState>(
  //   null,
  //   (dispatch: any) => ({
  //   }),
  // ),
  withForm<PropsViewInspectCarsConditionTableWithForm, InspectCarsCondition>({
    uniqField: 'id',
    updateAction: inspectionCarsConditionActions.actionUpdateInspectCarsCondition,
    withThrow: true,
    permissions: inspectCarsConditionPermissions,
    schema: null,
  }),
  withPreloader({
    typePreloader: 'mainpage',
    withPagePath: true,
  }),
)(ViewInspectCarsConditionTable);
