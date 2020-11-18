import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { omit } from 'lodash';

import { ColorForTable } from 'components/old/reports/operational/route_odh_coverage/styled';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { actionGetAndSetInStoreTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

type StateProps = {
  technicalOperationRegistryList: IStateSomeUniq['technicalOperationRegistryList'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};

type IPropsReportHeader = {
  technical_operations_ids: any;
} & IPropsReportHeaderCommon & IPropsReportHeaderWrapper & StateProps & DispatchProps;

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  componentDidMount() {
    this.props.dispatch(
      actionGetAndSetInStoreTechnicalOperationRegistry(
        {},
        {
          page: 'mainpage',
        },
      ),
    );
  }
  getState() {
    const { technical_operations_ids = '' } = this.props;

    return {
      technical_operations_ids,
    };
  }
  handleSubmit = () => {
    const { technical_operations_ids } = this.getState();

    const techOpIdsArray
      = typeof technical_operations_ids === 'string'
        ? [technical_operations_ids]
        : technical_operations_ids;

    const requestBody = {
      technical_operations_ids: `[${[...techOpIdsArray].join(',')}]`,
    };

    this.props.onClick(
      technical_operations_ids.length !== 0
        ? requestBody
        : omit(requestBody, 'technical_operations_ids'),
    );
  };
  render() {
    const { technical_operations_ids } = this.getState();

    const { technicalOperationRegistryList, readOnly } = this.props;

    const TECH_OPERATION_TYPES = technicalOperationRegistryList
      .filter((route) => route.objects_text.includes('ОДХ'))
      .map((t) => ({ value: t.id, label: t.name }));

    return (
      <EtsBootstrap.Row className="headerRow">
        <ColorForTable />
        <EtsBootstrap.Col lg={10} md={9}>
          <ExtField
            type="select"
            label="Технологическая операция"
            multi
            options={TECH_OPERATION_TYPES}
            value={technical_operations_ids}
            onChange={this.props.handleChange}
            boundKeys={'technical_operations_ids'}
            disabled={readOnly}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col lg={2} md={3} style={{ marginTop: 25 }}>
          <EtsBootstrap.Button block onClick={this.handleSubmit} disabled={readOnly}>
            Сформировать отчет
          </EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default compose(
  ReportHeaderWrapper,
  connect<StateProps, DispatchProps, any, ReduxState>(
    (state) => ({
      technicalOperationRegistryList: getSomeUniqState(state).technicalOperationRegistryList,
    }),
  ),
)(ReportHeader);
