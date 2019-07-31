import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import odhPermissions from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { odhFormSchema } from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/schema';

import { getDefaultOdhFormElement } from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnPropsOdhForm,
  PropsOdhForm,
  PropsOdhFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/@types/OdhForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';
import FieldCompanyStructureId from './fields/company_structure_id/FieldCompanyStructureId';

const OdhForm: React.FC<PropsOdhForm> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      isPermitted,
      IS_CREATING,
    } = props;

    const title = !IS_CREATING ? 'Объект дорожного хозяйства' : 'Объект дорожного хозяйства';

    return (
      <EtsBootstrap.ModalContainer id="modal-odh" show onHide={props.hideWithoutChanges}>
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
                label="Название"
                value={state.name}
                readOnly
              />
              <ExtField
                type="string"
                label="Категория"
                value={state.clean_category_name}
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
                label="Протяженность (п.м.)"
                value={state.distance}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь проезжей части (кв.м.)"
                value={state.roadway_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь тротуаров (кв.м.)"
                value={state.footway_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь уборки (кв.м.)"
                value={state.cleaning_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Длина тротуара (п.м.)"
                value={state.footway_length}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь механизированной уборки тротуаров (кв.м.)"
                value={state.auto_footway_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь ручной уборки тротуаров (кв.м.)"
                value={state.manual_footway_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь уборки снега (кв.м.)"
                value={state.snow_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Протяженность лотков (п.м.)"
                value={state.gutters_length}
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

export default compose<PropsOdhForm, OwnPropsOdhForm>(
  withForm<PropsOdhFormWithForm, Odh>({
    uniqField: 'id',
    createAction: geoobjectActions.actionCreateOdh,
    updateAction: geoobjectActions.actionUpdateOdh,
    mergeElement: (props) => {
      return getDefaultOdhFormElement(props.element);
    },
    schema: odhFormSchema,
    permissions: odhPermissions,
  }),
)(OdhForm);
