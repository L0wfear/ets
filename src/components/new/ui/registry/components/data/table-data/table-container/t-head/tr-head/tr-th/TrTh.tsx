import * as React from 'react';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { connect } from 'react-redux';
import * as cx from 'classnames';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryTriggerOnChangeSelectedField,
} from 'components/new/ui/registry/module/actions-registy';
import { EtsTheadTh } from './styled/styled';

type PropsTrTh = {
  registryKey: string;
  colData: any;
  registryTriggerOnChangeSelectedField: any;
  sort: {
    field: string;
    reverse: boolean;
  },
};

type StateTrTh = {

};

const getGlyphName = ({ colData: { key }, sort }) => {
  if (key !== 'enumerated' && key === sort.field) {
    // 'sort-by-attributes-alt'
    return `sort-by-attributes${sort.reverse ? '-alt' : ''}`;
  }

  return '';
};

class TrTh extends React.Component<PropsTrTh, StateTrTh> {
  handleClick: React.MouseEventHandler<HTMLTableHeaderCellElement> = () => {
    const {
      colData: {
        key,
        childrenFields,
      },
    } = this.props;

    if (!Array.isArray(childrenFields)) {
      if (key === 'selectAll') {
        // console.log('selectAll');
      } else if (key === 'enumerated') {
        // console.log('enumerated');
      } else {
        this.props.registryTriggerOnChangeSelectedField(key);
      }
    }
  }

  render() {
    const { colData } = this.props;
    const className = cx(
      colData.className,
      'ets-th',
    );

    return (
      <EtsTheadTh
        canClick={colData.key !== 'enumerated'}
        className={className}
        rowSpan={colData.rowSpan}
        colSpan={colData.colSpan}
        onClick={this.handleClick}
        width={colData.key === 'enumerated' ? 30 : null}
      >
        {colData.title}
        <Glyphicon glyph={getGlyphName(this.props)} />
      </EtsTheadTh>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  sort: getListData(state.registry, registryKey).processed.sort,
});

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  registryTriggerOnChangeSelectedField: (key) => (
    dispatch(
      registryTriggerOnChangeSelectedField(
        registryKey,
        key,
      ),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrTh);
