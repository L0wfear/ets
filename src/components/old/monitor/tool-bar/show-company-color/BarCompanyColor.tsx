import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';

import { ReduxState } from 'redux-main/@types/state';
import { LegenCompanyLegendOption, CubeColor } from 'components/old/monitor/tool-bar/show-company-color/styled';
import { Company } from 'redux-main/reducers/modules/company/@types';

type PropsBarCompanyColor = {
  companiesIndex: Record<Company['id'], Company>;
};

type StateBarCompanyColor = {
  isOpen: boolean;
  companiesOption: Array<{
    company_id: number;
    short_name: string;
    style: {
      backgroundColor: string;
    };
  }>;
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
  );

  render() {
    const { companiesOption } = this.state;

    return (
      !(companiesOption.length < 2) && (
        <span>
          <div className="tool_bar-block">
            <div className="default_cube companies">
              <div className="legen_option" onClick={this.toggleOpen}>
                <span>Цветовая гамма геообъектов</span>
              </div>
              <div className="car_block_legend left companies">
                {
                  this.state.isOpen && (
                    companiesOption.map((companyData) => (
                      <LegenCompanyLegendOption key={companyData.company_id}>
                        <div>{companyData.short_name}</div>
                        <CubeColor backgroundColor={companyData.style.backgroundColor}></CubeColor>
                      </LegenCompanyLegendOption>
                    ))
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

export default compose(
  withShowByProps({
    path: ['monitorPage', 'companiesIndex'],
    type: 'none',
  }),
  withShowByProps({
    path: ['monitorPage', 'geoobjects', GEOOBJECTS_OBJ.odh.serverName, 'show'],
    type: 'none',
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      companiesIndex: state.monitorPage.companiesIndex,
    }),
  ),
)(BarCompanyColor);
