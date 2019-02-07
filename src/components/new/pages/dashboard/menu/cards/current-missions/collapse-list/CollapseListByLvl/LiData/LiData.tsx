import * as React from 'react';

import {
  PropsLiData,
  StateLiData,
} from 'components/new/pages/dashboard/menu/cards/current-missions/collapse-list/CollapseListByLvl/LiData/LiData.h';

class LiData extends React.PureComponent<PropsLiData, StateLiData> {
  handleClick: React.MouseEventHandler<HTMLLIElement> = (e) => {
    const { props } = this;

    props.handleClick(
      props.subItem,
    );
  }

  render() {
    const { subItem } = this.props;

    return (
      <li className="pointer" onClick={this.handleClick}>{subItem.title}</li>
    );
  }
}

export default LiData;
