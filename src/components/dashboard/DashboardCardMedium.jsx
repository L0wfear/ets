import React from 'react';
import ReactDOM from 'react-dom';
import Div from 'components/ui/Div.jsx';
import { Panel, Collapse, Glyphicon, Fade, Well } from 'react-bootstrap';
import { FluxContext } from 'utils/decorators';
import cx from 'classnames';
import DashboardCardHeader from './DashboardCardHeader.jsx';
import DashboardItemChevron from './DashboardItemChevron.jsx';

@FluxContext
export default class DashboardCardMedium extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cardWidth: null,
      fullListOpen: false,
      selectedItem: null,
      items: [],
    };
  }

  componentDidMount() {
    const cardWidth = ReactDOM.findDOMNode(this.refs.card).offsetWidth;
    this.setState({ cardWidth });
  }

  selectItem(i) {
    const item = this.props.items[i];
    if ((item && item.subItems && item.subItems.length) || i === null || (item && item.data)) {
      this.setState({ selectedItem: i });
      this.props.openSubitemsList(i === null);
    } else if (typeof this.action === 'function') {
      this.action(i);
    }
  }

  toggleFullList() {
    this.setState({ fullListOpen: !!!this.state.fullListOpen });
  }

  refreshCard() {
    this.props.refreshCard();
  }

  renderSubitems(subItems) {
    return (
      <ul>
        {subItems.map((item, i) => <li key={i}>{item.title || item}</li>)}
      </ul>
    );
  }

  renderItems() {
    return this.props.items.map((item, i) => {
      const itemClassName = cx('dashboard-card-item', { 'pointer': (item.data) || (item.subItems && item.subItems.length) || (this.action) });
      return (<Div key={i} className={itemClassName} >
        {typeof item.value !== 'undefined' ?
          <Div className="dashboard-card-item-inner-singlevalue" onClick={this.selectItem.bind(this, i)}>
            {item.value}
          </Div>
          :
            <Div className="dashboard-card-item-inner" onClick={this.selectItem.bind(this, i)}>
              {item.title}
            </Div>
        }
        {
          typeof this.renderCollapsibleSubitems === 'function' ? this.renderCollapsibleSubitems(item, i) : ''
        }
      </Div>);
    });
  }

  render() {
    const selectedItemIndex = this.state.selectedItem;
    const selectedItem = this.props.items[selectedItemIndex] || null;
    const subItems = selectedItem !== null ? selectedItem.subItems || [] : [];
    const data = selectedItem !== null ? selectedItem.data || {} : {};
    const items = this.renderItems();
    let styleObject = {
      width: this.state.cardWidth, marginLeft: this.state.cardWidth + 30,
    };
    if (this.props.direction === 'left') {
      styleObject = {
        width: this.state.cardWidth, right: this.state.cardWidth + 44,
      };
    }
    if (!this.state.cardWidth) {
      styleObject = {};
    }
    const firstItems = items.slice(0, 2);
    const otherItems = items.slice(2, items.length);
    const Header = <DashboardCardHeader title={this.props.title} loading={this.props.loading} onClick={this.refreshCard.bind(this)} />;

    // отрефакторить

    return (
      <Div md={12}>
        <Panel className="dashboard-card" header={Header} bsStyle="success" ref="card">
          <Div className="dashboard-card-items">
            {firstItems}
            <Collapse in={this.state.fullListOpen}>
              <Div>
                {otherItems}
              </Div>
            </Collapse>
          </Div>

          <Div className="menu-down-block" hidden={otherItems.length === 0}>
            <Div style={{ textAlign: 'center' }} hidden={this.state.fullListOpen}>
              <Glyphicon glyph="menu-down" className="pointer" onClick={this.toggleFullList.bind(this)} />
            </Div>
            <Div style={{ textAlign: 'center' }} hidden={!this.state.fullListOpen}>
              <Glyphicon glyph="menu-up" className="pointer" onClick={this.toggleFullList.bind(this)} />
            </Div>
          </Div>

          <Div className="dashboard-card-overlay" hidden={!this.props.loading} />
        </Panel>

        <DashboardItemChevron direction={this.props.direction} hidden={selectedItem === null || (subItems.length === 0 && !data.mission_name) || !this.props.itemOpened} />

        <Div style={styleObject} hidden={(subItems.length === 0 && !data) || !this.props.itemOpened} className={cx('dashboard-card-info', { active: selectedItem !== null && this.props.itemOpened })} >
          <Fade in={selectedItem !== null && this.props.itemOpened}>
            <div>
              <Well>
                <Div className="card-glyph-remove" onClick={this.selectItem.bind(this, null)}>
                  <Glyphicon glyph="remove" />
                </Div>
                <h5>{this.props.itemsTitle || (selectedItem !== null ? selectedItem.title : '')}</h5>
                <div style={{ marginTop: 15 }} />
                {this.renderSubitems(subItems)}
                {typeof this.renderCustomCardData === 'function' ? this.renderCustomCardData() : null}
              </Well>
            </div>
          </Fade>
        </Div>
        {typeof this.renderCustomCardForm === 'function' ? this.renderCustomCardForm() : null}

      </Div>
    );
  }

}
