import React, { Component } from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

import { connectToStores, staticProps, exportable } from 'utils/decorators';
import REPAIR from 'constants/repair';
import ElementsList from 'components/ElementsList';
import ObjectPropertyTable from 'components/directories/repair/object_property/ObjectPropertyTable';
import permissions from 'components/directories/repair/object_property/config-data/permissions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

@connectToStores(['repair'])
@exportable({ entity: `${REPAIR.objectProperty}` })
@staticProps({
  entity: 'ets_object_properties',
  permissions,
  listName: 'objectPropertyList',
  tableComponent: ObjectPropertyTable,
  operations: ['LIST'],
})
class ObjectPropertyList extends ElementsList {
  constructor(props) {
    super(props);

    this.setExportType(props.typeData);
  }

  setExportType(object_type) {
    this.exportPayload = { object_type };
  }

  async init() {
    const { flux } = this.context;

    await flux.getActions('repair').getObjectProperty({ object_type: 'odh' }, { name: 'odh' });
    flux.getActions('repair').setActiveList('objectPropertyList', 'objectPropertyOdhList');
  }

  getAdditionalProps() {
    return {
      typeData: this.props.typeData,
    };
  }

  componentDidUpdate(prevProps) {
    const { typeData } = this.props;
    const { iHaveType = { 'odh': true } } = this.state;

    if (typeData !== prevProps.typeData) {
      this.setExportType(typeData);
      const { flux } = this.context;

      if (!iHaveType[typeData]) {
        iHaveType[typeData] = true;

        flux.getActions('repair').getObjectProperty({ object_type: typeData }, { name: typeData })
          .then(() => {
            this.setState({
              iHaveType,
            });
          })
          .catch((error) => {
            console.warn(error);
          });
      }
      flux.getActions('repair').setActiveList('objectPropertyList', `objectProperty${typeData[0].toUpperCase()}${typeData.slice(1)}List`);
    }
  }
}

const ObjectPropertyListWithUserData = compose(
  connect(
    state => ({
      userData: getSessionState(state).userData,
    }),
  ),
)(ObjectPropertyList);


export default class ObjectProperty extends Component {
  state = {
    typeData: 'odh',
  }

  setNewType = ({ target: { id: typeDateNew } }) => {
    if (this.state.typeData !== typeDateNew) {
      this.setState({ typeData: typeDateNew });
    }
  }

  render() {
    const { typeData } = this.state;

    return (
      <div>
        <div className="cleaning-rate-header">
          <ButtonGroup>
            <Button id="odh" active={typeData === 'odh'} onClick={this.setNewType}>ОДХ</Button>
            <Button id="dt" active={typeData === 'dt'} onClick={this.setNewType}>ДТ</Button>
          </ButtonGroup>
        </div>
        <ObjectPropertyListWithUserData typeData={typeData} />
      </div>
    );
  }
}
