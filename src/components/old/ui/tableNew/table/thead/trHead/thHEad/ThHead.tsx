import * as React from 'react';
import Div from 'components/old/ui/Div';
import * as cx from 'classnames';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const EtsTheadThL: any = EtsTheadTh;

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
      <EtsTheadThL canClick className={thClassName} data-title={thData.name} onClick={this.handleClick}>
        <Div className={'th-container'} >
          <Div>
            <Div>{thData.displayName}</Div>
          </Div>
          { !thData.notAvailableSort &&
            <Div className={className}>
              <EtsBootstrap.Glyphicon glyph={this.props.sortAscending ? 'sort-by-attributes-alt' : 'sort-by-attributes'} />
            </Div>
          }
        </Div>
      </EtsTheadThL>
    );
  }
}

export default ThHead;
