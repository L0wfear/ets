import * as React from 'react';
import { FooterEnd, DivNone } from 'global-styled/global-styled';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import ViewInspectPgmBaseButtonSubmit from './button_sumbit/ViewInspectPgmBaseButtonSubmit';
import {
  filedToCheckFall,
  filedToCheckFallHardPgm,
} from 'components/new/pages/inspection/pgm_base/form/view_inspect_pgm_base_form/filed_to_check/filedToCheck';
import ContainerBlock from './container_bloc';
import { ContainerForm, FooterForm } from '../../../common_components/form_wrap_check/styled';
import { compose } from 'recompose';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';
import inspectPgmBasePermissions from '../../_config_data/permissions';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { ViewInspectPgmBaseProps, PropsViewInspectPgmBaseWithForm, ViewInspectPgmBaseOwnProps } from './@types/ViewInspectPgmBase';
import { INSPECT_AUTOBASE_TYPE_FORM } from '../../../autobase/global_constants';
import { BoxContainer } from '../../../autobase/components/data/styled/InspectionAutobaseData';
import BlockInspectAutobaseDataFiles from '../../../autobase/form/view_inspect_autobase_form/blocks/block_data_files/BlockInspectAutobaseDataFiles';
import { getDefaultInspectPgmBaseElement } from './utils';
import BlockCarsConditionSetInspectEmployee from '../../../cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/BlockCarsConditionSetInspectEmployee';
import { inspectPgmBaseSchema } from './schema';
import BlockInspectPgmBaseMainInfo from './blocks/block_main_info/BlockInspectPgmBaseMainInfo';
import IAVisibleWarningContainer from '../../../container/filed_to_check/IAVisibleWarningContainer';

const ViewInspectPgmBase: React.FC<ViewInspectPgmBaseProps> = React.memo(
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
          <EtsBootstrap.Col md={6} sm={12}>
            <BlockInspectPgmBaseMainInfo
              base_address={state.base_address}
              base_type={state.base_type}

              head_balance_holder_base={state.head_balance_holder_base}
              errors_head_balance_holder_base={errors.head_balance_holder_base}
              head_operating_base={state.head_operating_base}
              errors_head_operating_base={errors.head_operating_base}

              onChange={props.handleChange}

              isPermitted={isPermittedChangeListParams}
            />
            <BoxContainer>
              <h4>
                Выявленные нарушения на базе:
              </h4>
              <IAVisibleWarningContainer
                onChange={onChangeData}
                data={state.data}
                errors={errors.data}
                isPermitted={isPermittedChangeListParams}
                filedToCheck={filedToCheckFall}
              />
            </BoxContainer>
            <BoxContainer>
              <h4>
                Нарушения, связанные с хранением твердых ПГМ:
              </h4>
              <IAVisibleWarningContainer
                onChange={onChangeData}
                data={state.data}
                errors={errors.data}
                isPermitted={isPermittedChangeListParams}
                filedToCheck={filedToCheckFallHardPgm}
              />
            </BoxContainer>
          </EtsBootstrap.Col>
          {
            state.can_have_container ? (
              <EtsBootstrap.Col md={6} sm={12}>
                <ContainerBlock
                  selectedInspectPgmBase={state}
                  onChangeData={onChangeData}
                  isPermittedChangeListParams={isPermittedChangeListParams}
                  errors={errors}

                  page={props.loadingPage}
                />
              </EtsBootstrap.Col>
            )
            : (
              <DivNone />
            )
          }
          <EtsBootstrap.Col md={6} sm={12}>
            <BlockInspectAutobaseDataFiles
              files={state.files}

              isPermittedChangeListParams={isPermittedChangeListParams}
              onChange={props.handleChange}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6} sm={12}>
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
            <ViewInspectPgmBaseButtonSubmit
              canSave={props.canSave}
              type={props.type}
              handleSubmit={props.defaultSubmit}
              isPermittedToUpdateClose={props.isPermittedToUpdateClose}
              handleHide={props.handleHide}
              selectedInspectPgmBase={state}
              loadingPage={props.loadingPage}
            />
            <EtsBootstrap.Button onClick={props.handleCloseWithoutChanges}>{props.type !== INSPECT_PGM_BASE_TYPE_FORM.closed ? 'Отмена' : 'Закрыть карточку'}</EtsBootstrap.Button>
          </FooterEnd>
        </FooterForm>
      </React.Fragment>
    );
  },
);

export default compose<ViewInspectPgmBaseProps, ViewInspectPgmBaseOwnProps>(
  withForm<PropsViewInspectPgmBaseWithForm, InspectPgmBase>({
    uniqField: 'id',
    updateAction: inspectionPgmBaseActions.actionUpdateInspectPgmBase,
    withThrow: true,
    mergeElement: (props) => {
      return getDefaultInspectPgmBaseElement(props.element);
    },
    permissions: inspectPgmBasePermissions,
    schema: inspectPgmBaseSchema,
  }),
  withPreloader({
    typePreloader: 'mainpage',
    withPagePath: true,
  }),
)(ViewInspectPgmBase);
