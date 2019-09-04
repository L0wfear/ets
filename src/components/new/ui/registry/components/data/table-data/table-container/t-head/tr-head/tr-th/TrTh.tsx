import * as React from 'react';
import { connect } from 'react-redux';
import { getListData, getRootRegistry } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryTriggerOnChangeSelectedField,
} from 'components/new/ui/registry/module/actions-registy';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { isAllChecked } from 'components/new/ui/registry/module/check_funk';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getGlyphName } from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/th/ThDefault';

type PropsTrTh = {
  registryKey: string;
  colData: any;
  registryTriggerOnChangeSelectedField: any;
  allIsChecked: boolean;
  sort: {
    field: string;
    reverse: boolean;
  },
};

type StateTrTh = {
};

class TrTh extends React.PureComponent<PropsTrTh, StateTrTh> {
  handleClick: React.MouseEventHandler<HTMLTableHeaderCellElement> = () => {
    const {
      colData: {
        key,
        childrenFields,
        sortable = true,
      },
    } = this.props;

    this.props.registryTriggerOnChangeSelectedField(key, sortable && !childrenFields);
  }

  render() {
    const {
      colData,
      colData: {
        title,
        sortable = true,
      },
    } = this.props;

    return (
      <EtsTheadTh
        canClick={sortable}
        rowSpan={colData.rowSpan}
        colSpan={colData.colSpan}
        onClick={this.handleClick}
        width={colData.width}
      >
        {
          colData.key === 'checkbox'
            ? (
              <ExtField
                type="boolean"
                error={false}
                label={false}
                value={this.props.allIsChecked}
                checkboxStyle={false}
                className={null}
              />
            )
            : (
              <React.Fragment>
                {title} <EtsBootstrap.Glyphicon glyph={getGlyphName(colData.key, this.props.sort)} />
              </React.Fragment>
            )
        }
      </EtsTheadTh>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  sort: getListData(state.registry, registryKey).processed.sort,
  allIsChecked: isAllChecked(getRootRegistry(state.registry, registryKey)),
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
