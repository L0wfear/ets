import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import dtPermissions from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { dtFormSchema } from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/schema';

import { getDefaultDtFormElement } from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnPropsDtForm,
  PropsDtForm,
  PropsDtFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/@types/DtForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import FieldCompanyStructureId from '../../odh/OdhForm/fields/company_structure_id/FieldCompanyStructureId';
import { actionCreateDt, actionUpdateDt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/actions';

const DtForm: React.FC<PropsDtForm> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      isPermitted,
    } = props;

    const IS_CREATING = !state.yard_id;

    const title = !IS_CREATING ? 'Дворовая территория' : 'Дворовая территория';

    return (
      <EtsBootstrap.ModalContainer id="modal-dt" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
              <ExtField
                type="string"
                label="Учреждение"
                value={state.company_name}
                readOnly
              />
              <ExtField
                type="string"
                label="Название ДТ"
                value={state.object_address}
                readOnly
              />
              <ExtField
                type="string"
                label="Общая площадь (кв.м.)"
                value={state.total_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Общая уборочная площадь (кв.м.)"
                value={state.clean_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь механизированной уборки (кв.м.)"
                value={state.auto_area}
                readOnly
              />
              <FieldCompanyStructureId
                value={state.company_structures}
                error={errors.company_structures}
                handleChange={props.handleChange}
                isPermitted={isPermitted}

                page={props.page}
                path={props.path}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
          )
          : (
            <DivNone />
          )
        }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  },
);

export default compose<PropsDtForm, OwnPropsDtForm>(
  withForm<PropsDtFormWithForm, Dt>({
    uniqField: 'yard_id',
    createAction: actionCreateDt,
    updateAction: actionUpdateDt,
    mergeElement: (props) => {
      return getDefaultDtFormElement(props.element);
    },
    schema: dtFormSchema,
    permissions: dtPermissions,
  }),
)(DtForm);
