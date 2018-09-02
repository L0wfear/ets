import * as React from 'react';
import * as cx from 'classnames';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import CollapseText from 'components/ui/collapse/text/CollapseText';

import CollapseList from 'components/dashboard/new/menu/cards/current-missions/collapse-list/CollapseList';

type PropsListByTypeMission = {
  title: string;
  items: any[];
  titleKey: string;
  itemsKey: string;
  handleClick: React.MouseEventHandler<HTMLLIElement>;
}

const ListByTypeMission: React.SFC<PropsListByTypeMission> = ({ title, items = [], ...props }) => (
  <CollapseText title={title} dependentData={items} classNameContainer={cx('line_data', 'bold', { pointer: items.length, 'no-pointer-events': !items.length })}>
    <CollapseList collapsetItems={items} handleClick={props.handleClick} />
  </CollapseText>
);

const mapStateToProps = (state, { titleKey, itemsKey } ) => ({
  title: state.dashboard.current_missions.data[titleKey],
  items: state.dashboard.current_missions.data[itemsKey],
});

export default hocAll(
  connect(
    mapStateToProps,
  ),
)(ListByTypeMission);