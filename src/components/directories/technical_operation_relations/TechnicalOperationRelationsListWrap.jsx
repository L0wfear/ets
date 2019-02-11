import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import { ExtField } from 'components/ui/new/field/ExtField';

import { FluxContext } from 'utils/decorators';
import { makeOptions } from 'components/ui/input/makeOptions';
import {
  customOptionsTechnicalOperation,
  customOptionsMunicipalFacility,
  customOptionsFuncType,
} from 'components/directories/technical_operation_relations/helpData';
import TechnicalOperationRelationsList from 'components/directories/technical_operation_relations/TechnicalOperationRelationsList';
import {
  TechnicalOperationRelationsListWrapContainer,
  TechnicalOperationRelationsListContainer,
} from './styled';

@FluxContext
class TechnicalOperationRelationsListWrap extends React.Component {
  state = {
    TECHNICAL_OPERATION_OPTIONS: [],
    MUNICIPAL_FACILITY_OPTIONS: [],
    ROUTE_TYPES: [],
    FUNC_TYPE_OPTIONS: [],
    technical_operation_id: null,
    municipal_facility_id: null,
    func_type_id: null,
    route_types: [],
  };

  componentDidMount() {
    this.context.flux
      .getActions('technicalOperation')
      .getTechnicalOperations()
      .then(({ result }) => {
        const options = makeOptions({
          data: result,
          options: customOptionsTechnicalOperation,
        });

        this.setState({ ...options });
      });
  }

  getMunicipalFacilityOptions(norm_ids) {
    if (norm_ids) {
      const payload = {
        start_date: new Date(),
        end_date: new Date(),
        norm_ids: norm_ids.join(','),
      };

      this.context.flux
        .getActions('missions')
        .getCleaningMunicipalFacilityList(payload)
        .then(({ municipal_facility_list }) => {
          const changesState = {
            MUNICIPAL_FACILITY_OPTIONS: this.state.MUNICIPAL_FACILITY_OPTIONS,
            municipal_facility_id: null,
          };

          const { MUNICIPAL_FACILITY_OPTIONS } = makeOptions({
            data: municipal_facility_list,
            options: customOptionsMunicipalFacility,
          });

          changesState.MUNICIPAL_FACILITY_OPTIONS = MUNICIPAL_FACILITY_OPTIONS;

          if (changesState.MUNICIPAL_FACILITY_OPTIONS.length === 1) {
            changesState.municipal_facility_id =
              changesState.MUNICIPAL_FACILITY_OPTIONS[0].value;

            this.getFuncTypes(
              changesState.MUNICIPAL_FACILITY_OPTIONS[0].normatives
                .map(({ id }) => id)
                .join(','),
            );
          }
          this.setState({ ...changesState });
        });
    } else {
      this.setState({ MUNICIPAL_FACILITY_OPTIONS: [] });
    }
  }

  getFuncTypes(norm_ids) {
    if (norm_ids) {
      this.context.flux
        .getActions('technicalOperation')
        .getTechOperationsByNormIds({ norm_ids })
        .then(({ result }) => {
          const changesState = {
            ROUTE_TYPES: this.state.ROUTE_TYPES,
            FUNC_TYPE_OPTIONS: this.state.FUNC_TYPE_OPTIONS,
            route_types: [],
            func_type_id: null,
          };

          const { FUNC_TYPE_OPTIONS, ROUTE_TYPES } = makeOptions({
            data: result,
            options: customOptionsFuncType,
          });

          changesState.ROUTE_TYPES = ROUTE_TYPES;
          changesState.FUNC_TYPE_OPTIONS = FUNC_TYPE_OPTIONS;

          if (changesState.ROUTE_TYPES.length === 1) {
            changesState.route_types = changesState.ROUTE_TYPES.map(
              ({ value }) => value,
            );
          }
          if (changesState.FUNC_TYPE_OPTIONS.length === 1) {
            changesState.func_type_id = changesState.FUNC_TYPE_OPTIONS[0].value;
          }

          this.setState({ ...changesState });
        });
    } else {
      this.setState({
        ROUTE_TYPES: [],
        FUNC_TYPE_OPTIONS: [],
      });
    }
  }

  handleChangeTechnicalOperation = (technical_operation_id, allValue) => {
    if (technical_operation_id !== this.state.technical_operation_id) {
      if (technical_operation_id) {
        this.getMunicipalFacilityOptions(allValue.norm_ids);
      } else {
        this.getMunicipalFacilityOptions(null);
      }

      this.setState({
        technical_operation_id,
        MUNICIPAL_FACILITY_OPTIONS: [],
        ROUTE_TYPES: [],
        FUNC_TYPE_OPTIONS: [],
        municipal_facility_id: null,
        route_types: [],
        func_type_id: null,
      });
    }
  };

  handleChangeMunicipalFacility = (municipal_facility_id, allValue) => {
    if (municipal_facility_id !== this.state.municipal_facility_id) {
      if (municipal_facility_id) {
        this.getFuncTypes(allValue.normatives.map(({ id }) => id).join(','));
      }
      this.setState({
        municipal_facility_id,
        FUNC_TYPE_OPTIONS: [],
        func_type_id: null,
      });
    }
  };

  handleChangeRouteType = (route_types) => {
    if (route_types !== this.state.route_types) {
      this.setState({ route_types });
    }
  };

  handleChangeFuncTypeId = (func_type_id) => {
    if (func_type_id !== this.state.func_type_id) {
      this.setState({ func_type_id });
    }
  };

  render() {
    const {
      technical_operation_id,
      municipal_facility_id,
      route_types,
      func_type_id,
    } = this.state;

    return (
      <TechnicalOperationRelationsListWrapContainer>
        <Row>
          <Col md={12} className="header">
            <Col md={12}>
              <h4>Сводная форма связей</h4>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Col md={3}>
              <ExtField
                id="technical_operation_id"
                type="select"
                label="Технологическая операция"
                options={this.state.TECHNICAL_OPERATION_OPTIONS}
                value={technical_operation_id}
                onChange={this.handleChangeTechnicalOperation}
                clearable={false}
              />
            </Col>
            <Col md={3}>
              <ExtField
                id="municipal_facility_id"
                type="select"
                label="Элемент"
                options={this.state.MUNICIPAL_FACILITY_OPTIONS}
                value={municipal_facility_id}
                onChange={this.handleChangeMunicipalFacility}
                disabled={!this.state.MUNICIPAL_FACILITY_OPTIONS.length}
                clearable={false}
              />
            </Col>
            <Col md={3}>
              <ExtField
                id="route_types"
                type="select"
                multi
                label="Тип объекта"
                options={this.state.ROUTE_TYPES}
                value={route_types}
                onChange={this.handleChangeRouteType}
                disabled={!this.state.ROUTE_TYPES.length}
                error={
                  this.state.ROUTE_TYPES.length && !route_types.length
                    ? 'Поле "Тип объекта" должно быть заполнено'
                    : ''
                }
                clearable={false}
              />
            </Col>
            <Col md={3}>
              <ExtField
                id="func_type_id"
                type="select"
                label="Тип техники"
                options={this.state.FUNC_TYPE_OPTIONS}
                value={func_type_id}
                onChange={this.handleChangeFuncTypeId}
                disabled={!this.state.FUNC_TYPE_OPTIONS.length}
                clearable={false}
              />
            </Col>
          </Col>
        </Row>
        <TechnicalOperationRelationsListContainer>
          {technical_operation_id &&
          municipal_facility_id &&
          route_types.length &&
          func_type_id ? (
              <TechnicalOperationRelationsList
                technical_operation_id={technical_operation_id}
                municipal_facility_id={municipal_facility_id}
                route_types={route_types}
                func_type_id={func_type_id}
              />
            ) : null}
        </TechnicalOperationRelationsListContainer>
      </TechnicalOperationRelationsListWrapContainer>
    );
  }
}

export default TechnicalOperationRelationsListWrap;
