import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';

type PropsTrTd = {
  registryKey: string;
  rowData: any;
  metaKey: string;
  indexRow: number;
  paginator: {
    currentPage: number;
    perPage: number;
  };
};

type StateTrTd = {

};

class TrTd extends React.Component<PropsTrTd, StateTrTd> {
  render() {
    const { metaKey, indexRow } = this.props;
    const className = cx('ets-td');

    if (metaKey === 'enumerated') {
      const { paginator } = this.props;

      return (
        <EtsTbodyTrTd className={className}>{indexRow + 1 + paginator.currentPage * paginator.perPage}</EtsTbodyTrTd>
      );
    }
    return (
      <EtsTbodyTrTd className={className}>{this.props.rowData[metaKey]}</EtsTbodyTrTd>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  paginator: getListData(state.registry, registryKey).paginator,
});

export default connect(
  mapStateToProps,
)(TrTd);
