import * as React from 'react';
import * as cx from 'classnames';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import CollapseText from 'components/ui/collapse/text/CollapseText';

import CollapseList from 'components/dashboard/menu/cards/future-missions/list/CollapseList';

import { PropsListByTypeMission } from 'components/dashboard/menu/cards/future-missions/list/@types/ListByTypeMission.h';

const ListByTypeMission: React.SFC<PropsListByTypeMission> = ({ title, items, ...props }) => (
  <CollapseText title={title} classNameContainer={cx('line_data', 'bold', { pointer: items.length, 'no-pointer-events': !items.length })} >
    <CollapseList collapsetItems={items} handleClick={props.handleClick} />
  </CollapseText>
);

const mapStateToProps = (state, { titleKey, itemsKey } ) => ({
  title: state.dashboard.future_missions.data[titleKey],
  items: state.dashboard.future_missions.data[itemsKey],
});

export default hocAll(
  connect(
    mapStateToProps,
  ),
)(ListByTypeMission);