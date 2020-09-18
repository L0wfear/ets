import * as React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import * as cx from 'classnames';
import { monitorPageToggleStatusGeoobject, monitorPageSetGeometry } from 'components/old/monitor/redux-main/models/actions-monitor-page';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { loadGeozones } from 'redux-main/trash-actions/geometry/geometry';
import {
  MONITOR_PAGE_SET_GEOMETRY,
} from 'components/old/monitor/redux-main/models/monitor-page';

const getActiveClassName = (activeMain) => (
  cx(
    'legen_option',
    'with_checkbox',
    {
      off: !activeMain,
    },
  )
);

const getClassNameByType = (props, type) => (
  cx(
    'legen_option',
    'with_checkbox',
    {
      off: !props[type],
    },
  )
);

class BarShowGeoobjects extends React.Component<any, any> {
  state = {
    showGeoObjList: false,
    FILTRED_GEOOBJECTS_LIST: Object.keys(GEOOBJECTS_OBJ).filter((key) => (
      this.props.permissions.includes(`${key}.list`)),
    ),
  };

  componentDidUpdate(prevProps) {
    const { geoobjectsFilter: key } = this.props;
    if(
      key
      && key !== 'cars'
      && key !== prevProps.geoobjectsFilter
    ) {
      if(!this.props[GEOOBJECTS_OBJ[key].serverName]) {
        this.props.toggleShowStatus([key]);
      }
      if(!this.state.showGeoObjList) {
        this.toggleList();
      }
    }
  }

  toggleList = () => {
    if (this.props.companiesIndex !== -1) {
      this.setState({
        showGeoObjList: !this.state.showGeoObjList,
      });
    }
  };
  toggleShowStatus: any = ({ currentTarget: { dataset: { type } } }) => {
    this.props.toggleShowStatus([type]);
  };

  toggleAllStatus = (event) => {
    if (this.props.companiesIndex !== -1) {
      const notActiveOptionsArr = this.state.FILTRED_GEOOBJECTS_LIST.filter((key) => !this.props[GEOOBJECTS_OBJ[key].serverName]);

      if (notActiveOptionsArr.length) {
        this.props.toggleShowStatus(
          notActiveOptionsArr.map((key) => (
            GEOOBJECTS_OBJ[key].serverName
          )),
        );
        if (this.state.showGeoObjList) {
          event.stopPropagation();
        }
      } else {
        this.props.toggleShowStatus(
          this.state.FILTRED_GEOOBJECTS_LIST.map((key) => (
            GEOOBJECTS_OBJ[key].serverName
          )),
        );
      }
    }
  };

  render() {
    const {
      FILTRED_GEOOBJECTS_LIST,
      showGeoObjList,
    } = this.state;

    const activeMain = !FILTRED_GEOOBJECTS_LIST.some((key) => !this.props[GEOOBJECTS_OBJ[key].serverName]);
    return FILTRED_GEOOBJECTS_LIST.length !== 0 && (
      <span>
        <div className={cx('tool_bar-block', { disabled: this.props.companiesIndex === -1 })}>
          <div className="default_cube">
            <div className={getActiveClassName(activeMain)} onClick={this.toggleList}>
              <input type="checkbox" checked={activeMain} readOnly onClick={this.toggleAllStatus} />
              <span>{`Объекты ${showGeoObjList ? ' \u25BC' : ' \u25BA'}`}</span>
            </div>
            {
              showGeoObjList && (
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
    );
  }
}

const mapStateToProps = (state) => ({
  companiesIndex: state.monitorPage.companiesIndex,
  permissions: state.session.userData.permissions,
  ...Object.values(GEOOBJECTS_OBJ).reduce((newObj, { serverName }) => ({
    ...newObj,
    [serverName]: state.monitorPage.geoobjects[serverName].show,
  }), {}),
  geoobjectsFilter: state.monitorPage.geoobjectsFilter,
});

const mergedPropd = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  ...ownProps,
  toggleShowStatus: (typeArr) => {
    const companies = Object.keys(stateProps.companiesIndex);
    const company_key = companies.length === 1 ? companies[0] : null;
    const company_id = company_key ? stateProps.companiesIndex[company_key].company_id : null;

    dispatch(
      monitorPageToggleStatusGeoobject(typeArr),
    );
    const whereClearData = [];

    typeArr.forEach((type) => {
      if (!stateProps[type]) {
        dispatch(
          loadGeozones(
            MONITOR_PAGE_SET_GEOMETRY,
            type,
            { loading: true },
            company_id,
          ),
        );
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
          }), {}),
        ),
      );
    }
  },
  dispatch,
});

export default compose(
  connect(
    mapStateToProps,
    null,
    mergedPropd,
  ),
)(BarShowGeoobjects);
