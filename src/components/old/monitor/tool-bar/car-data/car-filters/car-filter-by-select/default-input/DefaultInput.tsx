import * as React from 'react';
import { connect } from 'react-redux';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { monitorPageChangeFilter } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { PropsDefaultInput } from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/default-input/DefaultInput.h';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: inline-flex;
  justify-content: space-between;
  width: 250px;
`;

const DefaultInput: React.FC<PropsDefaultInput> = ({
  OPTIONS,
  OPTIONS: { length },
  ...props
}) => {

  const handleChangeCheckBox = React.useCallback(() => {
    props.changeFilter(!props.value);
    props.setRefreshCheckBoxFilter(true);
  }, [props.changeFilter, props.value, props.setRefreshCheckBoxFilter]);

  const handleClickRefresh = React.useCallback(() => {
    props.setRefreshCheckBoxFilter(true);
  }, [props.setRefreshCheckBoxFilter]);

  return props.type === 'checkbox' ? (
    <FlexContainer>
      <ExtField
        label={props.placeholder}
        type="boolean"
        value={props.value}
        onChange={handleChangeCheckBox}
        labelAfter
      />
      <EtsBootstrap.Button
        title="Перезагрузить данные"
        className="reload-button"
        onClick={handleClickRefresh}
      >
        <EtsBootstrap.Glyphicon glyph="repeat" />
      </EtsBootstrap.Button>
    </FlexContainer>
  ) : (
    <ExtField
      multi={props.type === 'multi'}
      label={false}
      clearable={true}
      type="select"
      value={props.value}
      onChange={props.changeFilter}
      placeholder={`${props.placeholder}${!length ? ' (нет данных)' : ''}`}
      options={OPTIONS}
      disabled={!length}
    />
  );
};

const mapStateToProps = (state, { keyField }) => ({
  value: state.monitorPage.filters.data[keyField],
});

const mapDispatchToProps = (dispatch, { keyField }) => ({
  changeFilter: (stringMulty: string) =>
    dispatch(monitorPageChangeFilter(keyField, stringMulty)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultInput);
