import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import { ExtField } from 'components/ui/Field.jsx';
import { monitorPageChangeFilter } from 'components/monitor/new/redux/models/actions-monitor-page';
import { carInfoSetGpsNumber } from 'components/monitor/new/info/car-info/redux/modules/actions-car-info';
import * as ClickOutHandler from 'react-onclickout';

class CarFilterByText extends React.Component<any, any> {
  state = {
    hidden: true,
  }
  toggleHidden: any = () => {
    const hidden = !this.state.hidden;

    this.setState({ hidden });
  }

  focusOn = node => {
    const element: HTMLDivElement = findDOMNode(node);
    if (element) {
      (element.querySelector('.form-control') as HTMLInputElement).focus();
    }
  }

  handleClickOut: any = () => {
    if (!this.state.hidden) {
      this.setState({ hidden: true });
    }
  }

  render() {
    return (
      <span>
        <ClickOutHandler onClickOut={this.handleClickOut}>
          <div className="tool_bar-block">
            <div className="default_cube flex-row map-car-filter">
              <div className="button-toggle" onClick={this.toggleHidden} >
                <Glyphicon glyph="search" />
              </div>

                {
                  this.state.hidden ?
                  (
                    <div className="none"></div>
                  )
                  :
                  (
                    <div className="car_text_filter-container">
                      <ExtField
                        ref={this.focusOn}
                        label={false}
                        type="string"
                        value={this.props.carFilterText}
                        onChange={this.props.changeCarFilterText}
                        placeholder="рег.номер/гар.номер/БНСО"
                      />
                      {
                        this.props.canFocusOnCar ?
                          <div className="input_text_action-wrap">
                            <div className="input_text_action" onClick={this.props.handleFocusOnCar}>
                              <Glyphicon glyph="screenshot" />
                              <span>Показать</span>
                            </div>
                          </div>
                        :
                          <div className="none"></div>
                      }
                    </div>
                  )
                }
            </div>
          </div>
        </ClickOutHandler>
      </span>
    )
  }
}
const mapStateToProps = state => ({
  carFilterText: state.monitorPage.filters.data.carFilterText,
  filtredCarGpsCode: Object.entries(state.monitorPage.filters.filtredCarGpsCode).filter(([gps_code, show]) => show)[0],
  canFocusOnCar: Object.values(state.monitorPage.filters.filtredCarGpsCode).filter(show => show).length === 1,
});

const mapDispatchToProps = dispatch => ({
  changeCarFilterText: ({ target: { value } }) => (
    dispatch(
      monitorPageChangeFilter('carFilterText', value),
    )
  ),
  dispatch,
});

const mergeProps = ({ filtredCarGpsCode, ...stateProps }, dispatchProps, ownerProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownerProps,
  handleFocusOnCar: () => {
    console.log(filtredCarGpsCode)
    return (
      dispatchProps.dispatch(
        carInfoSetGpsNumber(filtredCarGpsCode[0])
      )
    );
  }
});

 export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
 )(CarFilterByText);
