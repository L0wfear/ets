import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/Field.jsx';

import { connectToStores, FluxContext } from 'utils/decorators';
import { makeOptions } from 'components/ui/input/makeOptions';
import { customOptionsTechnicalOperation, customOptionsMunicipalFacility, customOptionsFuncType } from 'components/directories/technical_operation_relations/helpData';
import TechnicalOperationRelationsList from 'components/directories/technical_operation_relations/TechnicalOperationRelationsList';

@connectToStores(['objects', 'session'])
@FluxContext
class TechnicalOperationRelationsListWrap extends React.Component {
  state = {
    TECHNICAL_OPERATION_OPTIONS: [],
    MUNICIPAL_FACILITY_OPTIONS: [],
    FUNC_TYPE_OPTIONS: [],
    technical_operation_id: null,
    municipal_facility_id: null,
    func_type_id: null,
  }

  componentDidMount() {
    this.context.flux.getActions('technicalOperation').getTechnicalOperations().then(({ result }) => {
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
      this.context.flux.getActions('missions').getCleaningMunicipalFacilityList(payload)
        .then(({ result: { rows = [] } = {} }) => {
          const options = makeOptions({
            data: rows,
            options: customOptionsMunicipalFacility,
          });

          this.setState({ ...options });
        });
    } else {
      this.setState({ MUNICIPAL_FACILITY_OPTIONS: [] });
    }
  }

  getFuncTypes(norm_ids) {
    if (norm_ids) {
      this.context.flux.getActions('technicalOperation').getTechOperationsByNormIds({ norm_ids })
        .then(({ result }) => {
          const options = makeOptions({
            data: result,
            options: customOptionsFuncType,
          });

          this.setState({ ...options });
        });
    } else {
      this.setState({ FUNC_TYPE_OPTIONS: [] });
    }
  }

  handleChangeTechnicalOperation = (technical_operation_id, allValue) => {
    if (technical_operation_id) {
      this.getMunicipalFacilityOptions(allValue.norm_ids);
    } else {
      this.getMunicipalFacilityOptions(null);
    }

    this.setState({
      technical_operation_id,
      MUNICIPAL_FACILITY_OPTIONS: [],
      FUNC_TYPE_OPTIONS: [],
      municipal_facility_id: null,
      func_type_id: null,
    });
  }

  handleChangeMunicipalFacility = (municipal_facility_id, allValue) => {
    if (municipal_facility_id) {
      this.getFuncTypes(allValue.normatives.map(({ id }) => id).join(','));
    }
    this.setState({
      municipal_facility_id,
      FUNC_TYPE_OPTIONS: [],
      func_type_id: null,
    });
  }

  handleChangeFuncTypeId = (func_type_id) => {
    this.setState({ func_type_id });
  }

  render() {
    const {
      technical_operation_id,
      municipal_facility_id,
      func_type_id,
    } = this.state;

    return (
      <div>
        <Row>
          <Col md={12} className="header">
            <Col md={12}>
              <h4>Сводная форма связей</h4>
            </Col>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Col md={4}>
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
            <Col md={4}>
              <ExtField
                id="municipal_facility_id"
                type="select"
                label="Элемент"
                options={this.state.MUNICIPAL_FACILITY_OPTIONS}
                value={municipal_facility_id}
                onChange={this.handleChangeMunicipalFacility}
                clearable={false}
              />
            </Col>
            <Col md={4}>
              <ExtField
                id="func_type_id"
                type="select"
                label="Тип техники"
                options={this.state.FUNC_TYPE_OPTIONS}
                value={func_type_id}
                onChange={this.handleChangeFuncTypeId}
                clearable={false}
              />
            </Col>
          </Col>
          </Row>
        <div>
          {
            technical_operation_id && municipal_facility_id && func_type_id
            ?
              <TechnicalOperationRelationsList technical_operation_id={technical_operation_id} municipal_facility_id={municipal_facility_id} func_type_id={func_type_id} />
            :
              null
          }
        </div>
      </div>
    );
  }
}

export default TechnicalOperationRelationsListWrap;
