import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';
import { monitorPageToggleStatusShowGovNumber } from 'components/monitor/redux-main/models/actions-monitor-page';

const getClassNameByType = (props, type) => (
  cx(
    'legen_option',
    'with_checkbox',
    {
      off: !props[type],
    },
  )
);

class BarShowGovNumber extends React.Component<any, any> {
  render() {
    return (
      <span>
        <div className="tool_bar-block">
          <div className="default_cube">
            <div data-type="SHOW_GOV_NUMBER" onClick={this.props.toggleShowStatus} className={getClassNameByType(this.props, 'SHOW_GOV_NUMBER')}>
              <input readOnly type="checkbox" checked={this.props.SHOW_GOV_NUMBER} />
              <div>Рег. номер ТС</div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  SHOW_GOV_NUMBER: state.monitorPage.SHOW_GOV_NUMBER,
});

const mapDispatchToProps = (dispatch) => ({
  toggleShowStatus: ({ currentTarget: { dataset: { type } } }) => (
    dispatch(
      monitorPageToggleStatusShowGovNumber(),
    )
  ),
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(BarShowGovNumber);
