import * as React from 'react';
import { compose } from 'recompose';

import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FooterEnd } from 'global-styled/global-styled';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import ViewInspectAutobaseButtonSubmit from './button_sumbit/ViewInspectAutobaseButtonSubmit';
import { filedToCheck } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/filed_to_check/filedToCheck';
import { ContainerForm, FooterForm } from '../../../common_components/form_wrap_check/styled';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ViewInspectAutobaseProps, ViewInspectAutobaseOwnProps, PropsViewInspectAutobaseWithForm } from './@types/ViewInspectAutobase';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import inspectAutobasePermissions from '../../_config_data/permissions';
import { inspectAutobaseSchema } from './schema';
import { getDefaultInspectAutobaseElement } from './utils';
import BlockInspectAutobaseDataFiles from './blocks/block_data_files/BlockInspectAutobaseDataFiles';
import BlockCarsConditionSetInspectEmployee from '../../../cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/BlockCarsConditionSetInspectEmployee';
import IAVisibleWarningContainer from '../../../container/filed_to_check/IAVisibleWarningContainer';

const ViewInspectAutobase: React.FC<ViewInspectAutobaseProps> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
    } = props;

    const isPermittedChangeListParams = (
      props.isPermitted
      && props.type === INSPECT_AUTOBASE_TYPE_FORM.list
      || (
        props.isPermittedToUpdateClose
        && props.type === INSPECT_AUTOBASE_TYPE_FORM.closed
      )
    );

    const isPermittedChangeCloseParams = (
      props.isPermitted
      && props.type === INSPECT_AUTOBASE_TYPE_FORM.close
      || (
        props.isPermittedToUpdateClose
        && props.type === INSPECT_AUTOBASE_TYPE_FORM.closed
      )
    );

    const onChangeData = React.useCallback(
      (newPartialData) => {
        props.handleChange({
          data: {
            ...state.data,
            ...newPartialData,
          },
        });
      },
      [props.handleChange, state.data],
    );

    return (
        <React.Fragment>
          <ContainerForm>
            <EtsBootstrap.Col md={props.type === INSPECT_AUTOBASE_TYPE_FORM.list ? 12 : 6} sm={props.type === INSPECT_AUTOBASE_TYPE_FORM.list ? 12 : 6}>
              <BoxContainer>
                <ExtField
                  type="string"
                  label="Организация:"
                  value={state.company_short_name}
                  readOnly
                  inline
                />
                <ExtField
                  type="string"
                  label="Адрес базы:"
                  value={state.base_address}
                  readOnly
                  inline
                />
              </BoxContainer>
              <BoxContainer>
                <h4>
                  Выявленные нарушения:
                </h4>
                <IAVisibleWarningContainer
                  onChange={onChangeData}
                  data={state.data}
                  errors={errors.data}
                  isPermitted={isPermittedChangeListParams}
                  filedToCheck={filedToCheck}
                />
              </BoxContainer>
              <BlockInspectAutobaseDataFiles
                files={state.files}

                isPermittedChangeListParams={isPermittedChangeListParams}
                onChange={props.handleChange}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={props.type === INSPECT_AUTOBASE_TYPE_FORM.list ? 0 : 6} sm={props.type === INSPECT_AUTOBASE_TYPE_FORM.list ? 0 : 6}>
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
          </ContainerForm>
          <FooterForm md={12} sm={12}>
            <FooterEnd>
              <ViewInspectAutobaseButtonSubmit
                type={props.type}
                handleSubmit={props.defaultSubmit}
                isPermittedToUpdateClose={props.isPermittedToUpdateClose}
                handleHide={props.handleHide}
                selectedInspectAutobase={state}
                canSave={props.canSave}
                loadingPage={props.loadingPage}
              />
              <EtsBootstrap.Button onClick={props.handleCloseWithoutChanges}>{props.type !== INSPECT_AUTOBASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</EtsBootstrap.Button>
            </FooterEnd>
          </FooterForm>
        </React.Fragment>
      );
  },
);

export default compose<ViewInspectAutobaseProps, ViewInspectAutobaseOwnProps>(
  withForm<PropsViewInspectAutobaseWithForm, InspectAutobase>({
    uniqField: 'id',
    updateAction: inspectionAutobaseActions.actionUpdateInspectAutobase,
    withThrow: true,
    mergeElement: (props) => {
      return getDefaultInspectAutobaseElement(props.element);
    },
    permissions: inspectAutobasePermissions,
    schema: inspectAutobaseSchema,
  }),
  withPreloader({
    typePreloader: 'mainpage',
    withPagePath: true,
  }),
)(ViewInspectAutobase);
