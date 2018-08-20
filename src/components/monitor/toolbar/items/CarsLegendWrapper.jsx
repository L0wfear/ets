import * as React from 'react';
import cx from 'classnames';

import statuses from 'constants/statuses';

const StatusComponent = props =>
  <span className={cx({ 'half-visible': !props.active })}>
    {props.status.color ? <button className={'status-filter-icon'} onClick={props.onClick} style={{ backgroundColor: props.status.color }} /> : null}
    {props.status.title}
    {props.active ? <span style={{ fontSize: '80%', color: '#aaa' }}> ({props.status.amount})</span> : null}
  </span>;

// TODO jsdoc
class CarsLegendWrapper extends React.Component {

  static get propTypes() {
    return {
      filter: React.PropTypes.object,
      storeHandleSetFilter: React.PropTypes.func,
      byStatus: React.PropTypes.object,
      storeFilter: React.PropTypes.object,
      byConnectionStatus: React.PropTypes.object,
    };
  }

  toggleFilter(i) {
    const filter = this.props.filter.status.slice();
    const id = i.id;
    const index = filter.indexOf(id);

    if (index === -1) {
      filter.push(id);
    } else {
      filter.splice(index, 1);
    }

    this.props.storeHandleSetFilter({
      status: filter,
    });
  }

  render() {
    const totalOnline = this.props.byConnectionStatus[1];
    const byStatus = this.props.byStatus;

    const filter = this.props.storeFilter;

    const items = statuses
      .map(s => Object.assign({ amount: byStatus[s.id] }, s))
      .map((item, i) =>
          (
            <li key={i}>
              <StatusComponent
                active={filter.status.indexOf(item.id) !== -1}
                status={item}
                onClick={() => this.toggleFilter(item)}
              />
            </li>
        )
      );
    return (
      <div className="legend-wrapper app-toolbar-fill">
        <ul style={{ paddingLeft: 0 }}>
          <li style={{ fontSize: '16px' }}>
            <span className={cx({ 'half-visible': !this.props.storeFilter.status.length })}>
              <button
                className={'status-filter-icon'}
                onClick={() => this.props.storeHandleSetFilter({
                  status: !this.props.storeFilter.status.length ? [1, 2, 3, 4] : [],
                })}
                style={{ backgroundColor: 'white' }}
              />
              Активно:
              <span>&nbsp;{totalOnline}</span>
            </span>
          </li>
          {items}
        </ul>
      </div>
    );
  }
}

export default CarsLegendWrapper;
