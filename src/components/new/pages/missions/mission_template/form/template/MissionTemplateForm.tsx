import * as React from 'react';

import {
  PropsMissionTemplateForm,
  StatePropsMissionTemplate,
  DispatchPropsMissionTemplate,
  OwnMissionTemplateProps,
  PropsMissionTemplateWithForm,
} from './@types/index.h';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import missionTemplatePermissions from 'components/new/pages/missions/mission_template/_config-data/permissions';
import { ReduxState } from 'redux-main/@types/state';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { getDefaultMissionTemplateElement } from './utils';
import { missionTemplateFormSchema } from './schema';

import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import { getSessionState } from 'redux-main/reducers/selectors';

import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import { Dropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import withMapInConsumer from 'components/new/ui/map/context/withMapInConsumer';
import { printData } from 'utils/functions';
import EtsModal from 'components/new/ui/modal/Modal';
import FieldForColumnMission from 'components/new/pages/missions/mission/form/main/inside_fields/for_column/FieldForColumnMission';
import FieldCarIdsMission from 'components/new/pages/missions/mission/form/main/inside_fields/car_ids/FieldCarIdsMission';
import FieldStructureMission from 'components/new/pages/missions/mission/form/main/inside_fields/structure/FieldStructureMission';
import FieldTechnicalOperationMission from 'components/new/pages/missions/mission/form/main/inside_fields/technical_operation/FieldTechnicalOperationMission';
import FieldMunicipalFacilityIdMission from 'components/new/pages/missions/mission/form/main/inside_fields/municipal_facility_id/FieldMunicipalFacilityIdMission';
import FieldRouteIdMission from 'components/new/pages/missions/mission/form/main/inside_fields/route_id/FieldRouteIdMission';
import { IPropsHiddenMapForPrint } from 'components/new/pages/missions/mission/form/main/inside_fields/route_id/print/HiddenMapForPrint';
import { getDateWithMoscowTz, createValidDateTime } from 'utils/dates';
import {
  BtnGroupWrapper,
  DisplayFlexAlignCenterFooterForm,
  BtnPart,
} from 'global-styled/global-styled';

const printMapKeyBig = 'printMapKeyBig';
const printMapKeySmall = 'printMapKeySmall';

const hiddenMapConfig: IPropsHiddenMapForPrint['hiddenMapConfig'] = [
  {
    printMapKey: printMapKeyBig,
    width: '1132px',
    height: '1688px',
    rotationAngle: Math.PI / 2,
  },
  {
    printMapKey: printMapKeySmall,
    width: '602px',
    height: '912px',
  },
];

class MissionTemplateForm extends React.PureComponent<
  PropsMissionTemplateForm,
  { date_start: string }
> {
  state = {
    date_start: createValidDateTime(getDateWithMoscowTz()),
  };

  async printMissionTemplate(payloadOwn) {
    const { page, path } = this.props;

    const { blob } = await this.props.actionPrintFormMissionTemplate(
      payloadOwn,
      { page, path },
    );
    printData(blob);
  }
  handlePrint: any = async (mapKey: string) => {
    const { formState: state } = this.props;

    const result = await this.props.submitAction(state);

    if (result) {
      this.props.handleChange(result);

      const data = {
        template_id: result.id,
        size: '',
        image: null,
      };

      if (mapKey === printMapKeyBig) {
        data.size = 'a3';
      }
      if (mapKey === printMapKeySmall) {
        data.size = 'a4';
      }

      this.props.getMapImageInBase64ByKey(mapKey).then((image) => {
        if (image) {
          data.image = image;
          this.printMissionTemplate(data);
        }
      });
    }
  };

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      STRUCTURE_FIELD_VIEW,
    } = this.props;

    const IS_CREATING = !state.id;
    const title = !IS_CREATING ? 'Шаблон задания' : 'Создание шаблона задания';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <EtsModal
        id="modal-mission-template"
        show
        onHide={this.props.hideWithoutChanges}
        bsSize="large"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={STRUCTURE_FIELD_VIEW ? 6 : 12}>
              <Row>
                <Col md={3}>
                  <FieldForColumnMission
                    value={state.for_column}
                    error={errors.car_ids}
                    onChange={this.props.handleChange}
                    disabled={!isPermitted} // внутри ещё проверка
                    page={page}
                    path={path}
                  />
                </Col>
                <Col md={9}>
                  <FieldCarIdsMission
                    value={state.car_ids}
                    disabled={!isPermitted}
                    isPermitted={isPermitted}
                    error={errors.car_ids}
                    onChange={this.props.handleChange}
                    for_column={state.for_column}
                    municipal_facility_id={state.municipal_facility_id}
                    structure_id={state.structure_id}
                    car_gov_numbers={state.car_gov_numbers}
                    car_model_names={state.car_model_names}
                    car_special_model_names={state.car_special_model_names}
                    car_type_ids={state.car_type_ids}
                    car_type_names={state.car_type_names}

                    IS_TEMPLATE

                    page={page}
                    path={path}
                  />
                </Col>
              </Row>
            </Col>
            {
              STRUCTURE_FIELD_VIEW
              ? (
                <Col md={6}>
                  <FieldStructureMission
                    value={state.structure_id}
                    name={state.structure_name}
                    disabled={!isPermitted}
                    error={errors.structure_id}
                    onChange={this.props.handleChange}
                    page={page}
                    path={path}
                  />
                </Col>
            ) : (
              <DivNone />
            )
            }
          </Row>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <FieldTechnicalOperationMission
                    value={state.technical_operation_id}
                    name={state.technical_operation_name}
                    isPermitted={isPermitted}
                    disabled={!isPermitted || !state.car_ids.length}
                    error={errors.technical_operation_id}
                    onChange={this.props.handleChange}

                    car_ids={state.car_ids}
                    for_column={state.for_column}

                    IS_TEMPLATE
                    MISSION_IS_ORDER_SOURCE={false}

                    page={page}
                    path={path}
                  />
                </Col>
                <Col md={12}>
                  <FieldMunicipalFacilityIdMission
                    value={state.municipal_facility_id}
                    name={state.municipal_facility_name}
                    disabled={!isPermitted || !state.technical_operation_id}
                    error={errors.municipal_facility_id}
                    isPermitted={isPermitted}
                    onChange={this.props.handleChange}
                    technical_operation_id={state.technical_operation_id}
                    IS_TEMPLATE
                    MISSION_IS_ORDER_SOURCE={false}

                    date_start={this.state.date_start}
                    page={page}
                    path={path}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <ExtField
                id="passes-count"
                type="string"
                label="Количество циклов"
                error={errors.passes_count}
                disabled={!isPermitted}
                value={state.passes_count}
                onChange={this.props.handleChange}
                boundKeys="passes_count"
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FieldRouteIdMission
                error={errors.route_id}
                value={state.route_id}
                name={state.route_name}
                municipal_facility_id={state.municipal_facility_id}
                municipal_facility_name={state.municipal_facility_name}
                technical_operation_id={state.technical_operation_id}
                technical_operation_name={state.technical_operation_name}
                for_column={state.for_column}
                MISSION_IS_ORDER_SOURCE={false}
                disabled={
                  !isPermitted
                  || !state.municipal_facility_id
                }
                isPermitted={isPermitted}
                structure_id={state.structure_id}
                structure_name={state.structure_name}
                mission_id={state.id}
                onChange={this.props.handleChange}
                fromMissionTemplate={true}
                fromMission={true}
                IS_TEMPLATE

                hiddenMapConfig={hiddenMapConfig}

                page={page}
                path={path}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <ExtField
                id="m-comment"
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                disabled={!isPermitted}
                onChange={this.props.handleChange}
                boundKeys="comment"
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
          {isPermitted ? ( // либо обновление, либо создание
            <DisplayFlexAlignCenterFooterForm>
              <BtnGroupWrapper>
                <BtnPart>
                  <Dropdown
                    id="mission_template-print-dropdown"
                    dropup
                    onSelect={this.handlePrint}
                    disabled={!this.props.canSave}>
                    <Dropdown.Toggle>
                      <Glyphicon id="m-print" glyph="print" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <MenuItem eventKey={printMapKeyBig}>Формате А3</MenuItem>
                      <MenuItem eventKey={printMapKeySmall}>Формате А4</MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                </BtnPart>
                <BtnPart>
                  <Button
                    disabled={!this.props.canSave}
                    onClick={this.props.defaultSubmit}>
                    Сохранить
                  </Button>
                </BtnPart>
              </BtnGroupWrapper>
            </DisplayFlexAlignCenterFooterForm>
          ) : (
            <DivNone />
          )}
        </Modal.Footer>
      </EtsModal>
    );
  }
}

export default compose<PropsMissionTemplateForm, OwnMissionTemplateProps>(
  connect<
    StatePropsMissionTemplate,
    DispatchPropsMissionTemplate,
    OwnMissionTemplateProps,
    ReduxState
  >(
    (state) => ({
      userStructureId: getSessionState(state).userData.structure_id,
      userStructureName: getSessionState(state).userData.structure_name,
      ...getSessionStructuresParams(state),
    }),
    (dispatch: any) => ({
      actionPrintFormMissionTemplate: (...arg) =>
        dispatch(missionsActions.actionPrintFormMissionTemplate(...arg)),
    }),
  ),
  withMapInConsumer(),
  withForm<PropsMissionTemplateWithForm, MissionTemplate>({
    uniqField: 'id',
    createAction: missionsActions.actionCreateMissionTemplate,
    updateAction: missionsActions.actionUpdateMissionTemplate,
    mergeElement: ({ element, userStructureId, userStructureName }) => {
      return getDefaultMissionTemplateElement({
        ...element,
        structure_id: (element && element.structure_id) || userStructureId,
        structure_name:
          element && (element.structure_name || element.structure_id)
            ? null
            : userStructureName,
      });
    },
    schema: missionTemplateFormSchema,
    permissions: missionTemplatePermissions,
  }),
)(MissionTemplateForm);
