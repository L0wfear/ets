import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import TrHead from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/TrHead';

type PropsThead = {
  registryKey: string;
  fieldsInDeepArr: any;
};

type StateThead = {

};

class Thead extends React.Component<PropsThead, StateThead> {
  render() {
    const { registryKey } = this.props;

    return (
      <thead className="ets_table_thead">
        {
          this.props.fieldsInDeepArr.map((thDataRow, index) => (
            <TrHead key={index} thDataRow={thDataRow} registryKey={registryKey} />
          ))
        }
      </thead>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  noEnumerated: getListData(state.registry, registryKey).meta.noEnumerated,
  fieldsInDeepArr: getListData(state.registry, registryKey).meta.fieldsInDeepArr,
});

export default connect(
  mapStateToProps,
)(Thead);
