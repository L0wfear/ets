import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { connect } from 'react-redux';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import { TypeCompaniesIndex } from 'redux/trash-actions/uniq/promise.h';

import {
  DivNone,
} from 'global-styled/global-styled';

require('components/monitor/new/tool-bar/show-company-color/BarCompanyColor.scss');

type PropsBarCompanyColor = {
  companiesIndex: TypeCompaniesIndex,
};

type StateBarCompanyColor = {
  isOpen: boolean;
  companiesOption: {
    company_id: number;
    short_name: string;
    style: {
      backgroundColor: string;
    };
  }[];
};

class BarCompanyColor extends React.Component<PropsBarCompanyColor, StateBarCompanyColor> {
  state = {
    isOpen: false,
    companiesOption: Object.values(this.props.companiesIndex).map(({ short_name, rgb_color, company_id }) => ({
      company_id,
      short_name,
      style: {
        backgroundColor: rgb_color,
      },
    })),
  };

  toggleOpen = () => (
    this.setState({
      isOpen: !this.state.isOpen,
    })
  )

  render() {
    const { companiesOption } = this.state;

    return (
      companiesOption.length < 2 ?
      (
        <DivNone />
      )
      :
      (
        <span>
          <div className="tool_bar-block">
            <div className="default_cube dark companies">
              <div className="legen_option" onClick={this.toggleOpen}>
                <span>Цветовая гамма геообъектов</span>
              </div>
              <div className="car_block_legend left companies">
                {
                  this.state.isOpen ?
                  (
                    companiesOption.map((companyData) => (
                      <div key={companyData.company_id} className="legen_option company_legend">
                        <div>{companyData.short_name}</div>
                        <div className="cube_color" style={companyData.style}></div>
                      </div>
                    ))
                  )
                  :
                  (
                    <DivNone />
                  )
                }
              </div>
            </div>
          </div>
        </span>
      )
    );
  }
}

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'companiesIndex'],
    type: 'none',
  }),
  withShowByProps({
    path: ['monitorPage', 'geoobjects', GEOOBJECTS_OBJ.odh.serverName, 'show'],
    type: 'none',
  }),
  connect(
    state => ({
      companiesIndex: state.monitorPage.companiesIndex,
    }),
  ),
)(BarCompanyColor);
