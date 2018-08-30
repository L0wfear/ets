import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';

import * as cx from 'classnames';
import { monitorPageToggleStatusGeoobject, monitorPageSetGeometry } from 'components/monitor/new/redux/models/actions-monitor-page';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { loadGeozones } from 'redux/trash-actions/geometry/geometry';
import {
  MONITOR_PAGE_SET_GEOMETRY,
} from 'components/monitor/new/redux/models/monitor-page';

const getActiveClassName = (activeMain) => (
  cx(
    'legen_option',
    'with_checkbox',
    {
      off: !activeMain,
    }
  )
);

const getClassNameByType = (props, type) => (
  cx(
    'legen_option',
    'with_checkbox',
    {
      off: !props[type],
    }
  )
);

class BarShowGeoobjects extends React.Component<any, any> {
  state = {
    showGeoObjList: false,
    FILTRED_GEOOBJECTS_LIST: Object.keys(GEOOBJECTS_OBJ).filter((key) => (
      this.props.permissions.includes(`${key}.list`))
    ),
  }

  toggleList = (event) => {
    if (this.props.companiesIndex !== -1) {
      this.setState({
        showGeoObjList: !this.state.showGeoObjList,
      })
    }
  }
  toggleShowStatus: any = ({ currentTarget: { dataset: { type } } }) => {
    this.props.toggleShowStatus([type])
  }

  toggleAllStatus = (event) => {
    if (this.props.companiesIndex !== -1) {
      const notActiveOptionsArr = this.state.FILTRED_GEOOBJECTS_LIST.filter((key) => !this.props[GEOOBJECTS_OBJ[key].serverName]);

      if (notActiveOptionsArr.length) {
        this.props.toggleShowStatus(
          notActiveOptionsArr.map((key) => (
            GEOOBJECTS_OBJ[key].serverName
          ))
        );
        if (this.state.showGeoObjList) {
          event.stopPropagation();
        }
      } else {
        this.props.toggleShowStatus(
          this.state.FILTRED_GEOOBJECTS_LIST.map((key) => (
            GEOOBJECTS_OBJ[key].serverName
          ))
        );
      }
    }
  }

  render() {
    const {
      FILTRED_GEOOBJECTS_LIST,
      showGeoObjList,
    } = this.state;

    const activeMain = !FILTRED_GEOOBJECTS_LIST.some((key) => !this.props[GEOOBJECTS_OBJ[key].serverName]);
    return FILTRED_GEOOBJECTS_LIST.length === 0 ?
      (
        <div className="none"></div>
      )
      :
      (
        <span>
          <div className={cx('tool_bar-block', { disabled: this.props.companiesIndex === -1 })}>
            <div className="default_cube dark">
              <div className={getActiveClassName(activeMain)} onClick={this.toggleList}>
                <input type="checkbox" checked={activeMain} onClick={this.toggleAllStatus} />
                <span>{`Объекты ${showGeoObjList ? ' \u25BC' : ' \u25BA'}`}</span>
              </div>
              {
                !showGeoObjList ?
                (
                  <div className="none"></div>
                )
                :
                (
                  <div className="car_block_legend left">
                    {
                      FILTRED_GEOOBJECTS_LIST.map((key) => (
                        <div key={key} data-type={GEOOBJECTS_OBJ[key].serverName} onClick={this.toggleShowStatus} className={getClassNameByType(this.props, GEOOBJECTS_OBJ[key].serverName)}>
                          <input readOnly type="checkbox" checked={this.props[GEOOBJECTS_OBJ[key].serverName]} />
                          <div>{GEOOBJECTS_OBJ[key].label}</div>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
        </span>
      )
  }
}

const mapStateToProps = state => ({
  companiesIndex: state.monitorPage.companiesIndex,
  permissions: state.session.userData.permissions,
  ...Object.values(GEOOBJECTS_OBJ).reduce((newObj, { serverName }) => ({
    ...newObj,
    [serverName]: state.monitorPage.geoobjects[serverName].show,
  }), {}),
});

const mergedPropd = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  ...ownProps,
  toggleShowStatus: (typeArr) => {
    dispatch(
      monitorPageToggleStatusGeoobject(typeArr),
    );
    const whereClearData = [];

    typeArr.forEach(type => {
      if (!stateProps[type]) {
        dispatch(
          loadGeozones(MONITOR_PAGE_SET_GEOMETRY, type)
        )
      } else {
        whereClearData.push(type);
      }
    });

    if (whereClearData.length) {
      dispatch(
        monitorPageSetGeometry(
          whereClearData.reduce((newObj, type) => ({
            ...newObj,
            [type]: null,
          }), {})
        )
      );
    }
  },
  dispatch,
});

export default hocAll(
  connect(
    mapStateToProps,
    null,
    mergedPropd,
  ),
)
(BarShowGeoobjects);
