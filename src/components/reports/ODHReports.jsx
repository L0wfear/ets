import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import Field from 'components/ui/Field';
import connectToStores from 'flummox/connect';

import { EtsPageWrap } from 'global-styled/global-styled';

class ODHReports extends Component {
  static contextTypes = {
    flux: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getTypes();
  }

  handleChange() {
    // this.setState({selectedRoute});
  }

  render() {
    const { typesList = [] } = this.props;
    const TYPES = typesList.map(({ asuods_id, full_name }) => ({
      label: full_name,
      value: asuods_id,
    }));

    return (
      <EtsPageWrap inheritDisplay>
        <div className="some-header">
          <div className="waybills-buttons" />
        </div>

        <Row>
          <Col md={12}>
            <div className="panel panel-default">
              <div className="panel-heading">Генерация отчетов</div>
              <div className="panel-body odh-generation">
                <Row>
                  <Col md={4}>
                    <label>Период</label>
                    <Row>
                      <Col md={6}>
                        <DatePicker
                          date={new Date()}
                          onChange={this.handleChange.bind(this, 'date_start')}
                        />
                      </Col>
                      <Col md={6}>
                        <DatePicker
                          date={new Date()}
                          onChange={this.handleChange.bind(this, 'date_start')}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={2}>
                    <Field
                      type="select"
                      label="Типы ТС"
                      options={TYPES}
                      value={null}
                      onChange={this.handleChange.bind(
                        this,
                        'responsible_person_id',
                      )}
                    />
                  </Col>
                  <Col md={2}>
                    <Field
                      type="string"
                      label="Норма, ПМ"
                      value={null}
                      onChange={this.handleChange.bind(
                        this,
                        'responsible_person_id',
                      )}
                    />
                  </Col>
                  <Col md={2}>
                    <Field
                      type="string"
                      label="ТУ"
                      value={null}
                      onChange={this.handleChange.bind(
                        this,
                        'responsible_person_id',
                      )}
                    />
                  </Col>
                  <Col md={2}>
                    <Button bsStyle="primary">Запустить</Button>
                  </Col>
                </Row>
              </div>
            </div>

            <div className="panel panel-default">
              <div className="panel-heading">Фильтры</div>
              <div className="panel-body odh-filters">
                <Row>
                  <Col md={4}>
                    <label>Период</label>
                    <Row>
                      <Col md={6}>
                        <DatePicker
                          date={new Date()}
                          onChange={this.handleChange.bind(this, 'date_start')}
                        />
                      </Col>
                      <Col md={6}>
                        <DatePicker
                          date={new Date()}
                          onChange={this.handleChange.bind(this, 'date_start')}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <ButtonToolbar>
                      <Button bsStyle="primary">Применить</Button>
                      <Button bsStyle="default">Очистить</Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </EtsPageWrap>
    );
  }
}

export default connectToStores(ODHReports, ['objects']);
