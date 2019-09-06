import * as React from 'react';
import { compose } from 'recompose';

import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { FooterEnd } from 'global-styled/global-styled';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import ViewInspectAutobaseButtonSubmit from './button_sumbit/ViewInspectAutobaseButtonSubmit';
import { filedToCheck } from 'components/new/pages/inspection/autobase/form/view_inspect_autobase_form/filed_to_check/filedToCheck';
import { ContainerForm, FooterForm, TitleForm } from '../../../common_components/form_wrap_check/styled';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ViewInspectAutobaseProps, ViewInspectAutobaseOwnProps, PropsViewInspectAutobaseWithForm } from './@types/ViewInspectAutobase';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import inspectAutobasePermissions from '../../_config_data/permissions';
import { inspectAutobaseSchema } from './schema';
import { getDefaultInspectAutobaseElement } from './utils';
import BlockCarsConditionSetInspectEmployee from '../../../cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/BlockCarsConditionSetInspectEmployee';
import IAVisibleWarningContainer from '../../../container/filed_to_check/IAVisibleWarningContainer';

const ViewInspectAutobase: React.FC<ViewInspectAutobaseProps> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
    } = props;

    const isPermittedChangeCloseParams = (
      props.isPermittedToUpdateClose
      && props.type === INSPECT_TYPE_FORM.closed
    );

    const isPermittedChangeListParams = (
      props.isPermitted
      && props.type === INSPECT_TYPE_FORM.list
      || (
        isPermittedChangeCloseParams
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
            <EtsBootstrap.Col md={6} sm={6}>
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
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6} sm={6}>
              <BlockCarsConditionSetInspectEmployee
                type={props.type}
                isPermittedChangeListParams={isPermittedChangeListParams}
                isPermittedListPhotosOfSupportingDocuments={isPermittedChangeListParams}
                isPermittedListPhotosDefect={isPermittedChangeListParams}

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
            </EtsBootstrap.Col>
          </ContainerForm>
          <FooterForm md={12} sm={12}>
            <FooterEnd>
              <ViewInspectAutobaseButtonSubmit
                type={props.type}
                handleSubmit={handleSubmit}
                isPermittedToUpdateClose={props.isPermittedToUpdateClose}
                handleHide={props.handleHide}
                selectedInspectAutobase={state}
                canSave={props.canSave}
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
    askBeforeCloseIfChanged: {},
  }),
  withPreloader({
    typePreloader: 'mainpage',
    withPagePath: true,
  }),
)(ViewInspectAutobase);
