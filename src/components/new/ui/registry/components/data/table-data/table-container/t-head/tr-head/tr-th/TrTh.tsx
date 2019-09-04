import * as React from 'react';
import { connect } from 'react-redux';
import { getListData, getRootRegistry } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryTriggerOnChangeSelectedField, registryGlobalCheck,
} from 'components/new/ui/registry/module/actions-registy';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { isAllChecked } from 'components/new/ui/registry/module/check_funk';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type PropsTrTh = {
  registryKey: string;
  colData: any;
  registryTriggerOnChangeSelectedField: any;
  registryGlobalCheck: any;
  allIsChecked: boolean;
  sort: {
    field: string;
    reverse: boolean;
  },
};

type StateTrTh = {
};

const getGlyphName = ({ colData: { key }, sort }) => {
  if (key === sort.field) {
    return sort.reverse ? 'sort-by-attributes-alt' : 'sort-by-attributes';
  }

  return null;
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

    if (sortable) {
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
  }

  handleClickGlobalCheckbox = () => {
    this.props.registryGlobalCheck();
  };

  render() {
    const {
      colData,
      colData: {
        title,
        sortable = true,
      },
    } = this.props;

    if (colData.key === 'is_open') {
      return (
        <EtsTheadTh
          canClick={false}
          rowSpan={colData.rowSpan}
          colSpan={colData.colSpan}
          width={35}
        >
          {title || ' '}
        </EtsTheadTh>
      );
    }

    if (colData.key === 'checkbox') {
      return (
        <EtsTheadTh
          canClick={true}
          rowSpan={colData.rowSpan}
          colSpan={colData.colSpan}
          onClick={this.handleClickGlobalCheckbox}
          width={30}
        >
          <ExtField
            type="boolean"
            error={false}
            label={false}
            value={this.props.allIsChecked}
            checkboxStyle={false}
            className={null}
          />
        </EtsTheadTh>
      );
    }

    if (colData.key === 'enumerated') {
      return (
        <EtsTheadTh
          canClick={false}
          rowSpan={colData.rowSpan}
          colSpan={colData.colSpan}
          width={50}
        >
          {title}
        </EtsTheadTh>
      );
    }

    if (colData.key === 'buttonCloneTire') {
      return (
        <EtsTheadTh
          canClick={false}
          rowSpan={colData.rowSpan}
          colSpan={colData.colSpan}
          width={200}
        >
          {title}
        </EtsTheadTh>
      );
    }

    if (colData.key === 'show_file_list') {
      return (
        <EtsTheadTh
          canClick={false}
          rowSpan={colData.rowSpan}
          colSpan={colData.colSpan}
          width={350}
        >
          {title}
        </EtsTheadTh>
      );
    }

    if (colData.key === 'show_edc_comments') {
      return (
        <EtsTheadTh
          canClick={false}
          rowSpan={colData.rowSpan}
          colSpan={colData.colSpan}
          width={75}
        >
          {title}
        </EtsTheadTh>
      );
    }

    if (colData.key === 'showMissionInfo') {
      return (
        <EtsTheadTh
          canClick={false}
          rowSpan={colData.rowSpan}
          colSpan={colData.colSpan}
          width={150}
        >
          {title}
        </EtsTheadTh>
      );
    }

    if (colData.key === 'company_structure_actions') {
      return (
        <EtsTheadTh
          canClick={false}
          rowSpan={colData.rowSpan}
          colSpan={colData.colSpan}
          width={250}
        >
          {title}
        </EtsTheadTh>
      );
    }

    return (
      <EtsTheadTh
        canClick={sortable}
        rowSpan={colData.rowSpan}
        colSpan={colData.colSpan}
        onClick={this.handleClick}
        width={colData.width}
      >
        {title} <EtsBootstrap.Glyphicon glyph={getGlyphName(this.props)} />
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
  registryGlobalCheck: () => (
    dispatch(
      registryGlobalCheck(registryKey),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrTh);
