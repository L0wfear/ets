import * as React from 'react';
import {
  PropsFutureMissionLiData,
  StateFutureMissionLiData,
} from 'components/new/pages/dashboard/menu/cards/future-missions/list/LiData/FutureMissionLiData.h';

class FutureMissionLiData extends  React.PureComponent<PropsFutureMissionLiData, StateFutureMissionLiData> {
  handleClick: React.MouseEventHandler<HTMLLIElement> = () => {
    this.props.handleClick(
      this.props.item.id,
    );
  }

  render() {
    const { props } = this;
    const { item } = props;

    return (
      <li
        key={item.id}
        className="pointer initial_font_weight"
        onClick={this.handleClick}
      >
        {item.name}
      </li>
    );
  }
}

export default FutureMissionLiData;
