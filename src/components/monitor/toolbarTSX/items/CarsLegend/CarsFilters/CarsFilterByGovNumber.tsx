import * as React from 'react';
import * as cx from 'classnames';
import ButtonCarsFilter from 'components/monitor/toolbarTSX/items/CarsLegend/CarsFilters/ButtonCarsFilter';

class CarsFilterByGovNumber extends React.Component<any, any> {
  state = { isOpen: false };

  handleClick = () => this.setState({ isOpen: !this.state.isOpen });
  render() {
    const filterFieldClass = cx('filter-second-field', this.state.isOpen ? 'open' : 'close');
    return (
      <div >
        <ButtonCarsFilter className="search" onClick={this.handleClick} />
        <div className={filterFieldClass}>
        </div>
      </div >
    );
  }
}

export default CarsFilterByGovNumber;
