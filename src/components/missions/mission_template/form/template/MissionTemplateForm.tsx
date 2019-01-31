import * as React from 'react';
import memoize from 'memoize-one';

import {
  PropsMissionTemplateForm,
  StatePropsMissionTemplate,
  DispatchPropsMissionTemplate,
  OwnMissionTemplateProps,
  PropsMissionTemplateWithForm,
} from './@types/index.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import missionActions from 'redux-main/reducers/modules/missions/actions';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import missionTemplatePermissions from 'components/missions/mission_template/config-data/permissions';
import { ReduxState } from 'redux-main/@types/state';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { getDefaultMissionTemplateElement, getStructureParam } from './utils';
import { missionTemplateFormSchema } from './schema';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import { getSessionState } from 'redux-main/reducers/selectors';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';

import FieldTechnicalOperationMissionTemplate from 'components/missions/mission_template/form/template/inside_fields/technical_operation/FieldTechnicalOperationMissionTemplate';
import FieldStructureMissionTemplate from 'components/missions/mission_template/form/template/inside_fields/structure/FieldStructureMissionTemplate';
import FieldMunicipalFacilityMissionTemplate from 'components/missions/mission_template/form/template/inside_fields/municipal_facility/FieldMunicipalFacilityMissionTemplate';
import FieldCarIdsMissionTemplate from 'components/missions/mission_template/form/template/inside_fields/car_ids/FieldCarIdsMissionTemplate';
import FieldForColumnMissionTemplate from 'components/missions/mission_template/form/template/inside_fields/for_column/FieldForColumnMissionTemplate';
import FieldRouteMissionTemplate from 'components/missions/mission_template/form/template/inside_fields/route/FieldRouteMissionTemplate';

class MissionTemplateForm extends React.PureComponent<PropsMissionTemplateForm, {}> {
  makeOptionFromStructures = (
    memoize(
      (structures: InitialStateSession['userData']['structures']) => (
        structures
          .map(defaultSelectListMapper)
      ),
    )
  );

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      userStructureId,
      structures,
    } = this.props;

    const IS_CREATING = !state.id;
    const title = !IS_CREATING ? 'Задание' : 'Создание шаблона задания';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const STRUCTURES = this.makeOptionFromStructures(
      structures,
    );

    const {
      STRUCTURE_FIELD_VIEW,
      STRUCTURE_FIELD_READONLY,
      STRUCTURE_FIELD_DELETABLE,
    } = getStructureParam(
      userStructureId,
      STRUCTURES,
    );

    return (
      <Modal id="modal-mission-template" show onHide={this.props.hideWithoutChanges} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={STRUCTURE_FIELD_VIEW ? 9 : 12}>
            <FieldTechnicalOperationMissionTemplate
              value={state.technical_operation_id}
              name={state.technical_operation_name}
              disabled={false}
              error={errors.technical_operation_id}
              onChange={this.props.handleChange}

              page={page}
              path={path}
            />
          </Col>
            {
              STRUCTURE_FIELD_VIEW
                ? (
                  <Col md={3}>
                    <FieldStructureMissionTemplate
                      value={state.structure_id}
                      name={state.structure_name}
                      disabled={STRUCTURE_FIELD_READONLY}
                      error={errors.structure_id}
                      clearable={STRUCTURE_FIELD_DELETABLE}
                      STRUCTURES={STRUCTURES}
                      onChange={this.props.handleChange}

                      car_ids={state.car_ids}

                      page={page}
                      path={path}
                    />
                  </Col>
                )
                : (
                  <DivNone />
                )
            }
          </Row>
          <Row>
            <Col md={12}>
              <FieldMunicipalFacilityMissionTemplate
                value={state.municipal_facility_id}
                name={state.municipal_facility_name}
                disabled={!state.technical_operation_id}
                error={errors.municipal_facility_id}
                onChange={this.props.handleChange}

                technical_operation_id={state.technical_operation_id}

                page={page}
                path={path}
              />
            </Col>
            <Col md={8}>
              <FieldCarIdsMissionTemplate
                value={state.car_ids}
                disabled={!state.municipal_facility_id}
                error={errors.car_ids}
                onChange={this.props.handleChange}

                for_column={state.for_column}
                municipal_facility_id={state.municipal_facility_id}
                structure_id={state.structure_id}

                page={page}
                path={path}
              />
            </Col>
            <Col md={4}>
              <FieldForColumnMissionTemplate
                value={state.for_column}
                error={errors.car_ids}
                onChange={this.props.handleChange}
                disabled={false}

                municipal_facility_id={state.municipal_facility_id}

                page={page}
                path={path}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <ExtField
                type="number"
                modalKey={page}
                id="passes_count"
                label="Количество циклов"
                error={errors.passes_count}
                value={state.passes_count}
                onChange={this.props.handleChange}
                boundKeys="passes_count"
                min="0"
              />
            </Col>
            <Col md={6}>
              <ExtField
                id="comment"
                type="string"
                modalKey={page}
                label="Комментарий"
                value={state.comment}
                onChange={this.props.handleChange}
                error={errors.comment}
                boundKeys="comment"
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FieldRouteMissionTemplate
                error_route_id={errors.route_id}
                route_id={state.route_id}
                handleChange={this.props.handleChange}

                municipal_facility_id={state.municipal_facility_id}
                municipal_facility_name={state.municipal_facility_name}
                structure_id={state.structure_id}
                structure_name={state.structure_name}
                technical_operation_id={state.technical_operation_id}
                technical_operation_name={state.technical_operation_name}
                for_column={state.for_column}

                page={page}
                path={path}
              />
            </Col>
          </Row>

        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsMissionTemplateForm, OwnMissionTemplateProps>(
  connect<StatePropsMissionTemplate, DispatchPropsMissionTemplate, OwnMissionTemplateProps, ReduxState>(
    (state) => ({
      structures: getSessionState(state).userData.structures,
      userStructureId: getSessionState(state).userData.structure_id,
      userStructureName: getSessionState(state).userData.structure_name,
    }),
  ),
  withForm<PropsMissionTemplateWithForm, MissionTemplate>({
    uniqField: 'id',
    createAction: missionActions.actionCreateMissionTemplate,
    updateAction: missionActions.actionUpdateMissionTemplate,
    mergeElement: ({ element, userStructureId, userStructureName }) => {
      return getDefaultMissionTemplateElement({
        ...element,
        structure_id: element && element.structure_id || userStructureId,
        structure_name: element && (element.structure_name || element.structure_id) ? null : userStructureName,
      });
    },
    schema: missionTemplateFormSchema,
    permissions: missionTemplatePermissions,
  }),
)(MissionTemplateForm);
