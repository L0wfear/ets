import * as React from 'react';
import Div from 'components/ui/Div';
import * as cx from 'classnames';
import { Glyphicon } from 'react-bootstrap';

class ThHead extends React.Component<any, any> {
  handleClick = (e) => {
    const { thData } = this.props;
    if (!thData.notAvailableSort) {
      this.props.handleClick(this.props.thData.name);
    }

    e.preventDefault();
  }

  render() {
    const { thData } = this.props;
    const className = this.props.sortField === thData.name ? 'sortfield' : 'sortfield-hidden';
    const showIt = typeof thData.display === 'boolean' ? thData.display : true;
    const thClassName = cx(
      thData.cssClassName,
      { 'display-none': !showIt, },
    );

    return (
      <th className={thClassName} data-title={thData.name} onClick={this.handleClick}>
        <Div className={'th-container'} >
          <Div>
            <Div>{thData.displayName}</Div>
          </Div>
          { !thData.notAvailableSort &&
            <Div className={className}>
              <Glyphicon glyph={`sort-by-attributes${this.props.sortAscending ? '-alt' : ''}`} />
            </Div>
          }
        </Div>
      </th>
    );
  }
}

export default ThHead;