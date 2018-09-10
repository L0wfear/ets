import * as React from 'react';
import { connectToStores } from 'utils/decorators';

require('./CompanyLegend.scss');

@connectToStores('objects')
class CompanyLegend extends React.Component<any, any> {
  state = {
    show: false,
  };

  setShow = () => {
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    const { organizations, selectedPolysTypes = [] } = this.props;
    const { show } = this.state;

    if (organizations.length < 2) {
      return null;
    }

    return selectedPolysTypes.includes('odh') && (
      <div className="app-toolbar-fill app-toolbar-show-geoobjects all-list" >
        <div className="checkbox">
          <label
            style={{ fontSize: 13, fontWeight: 200, paddingLeft: 0, marginLeft: 20 }}
            onClick={this.setShow}
          >
            Цветовая гамма геообъектов
          </label>
        </div>
        {
          show &&
          (
            <ul className="comppany-legend-container">
              {
                organizations.map(orgData => (
                  <li className="comppany-legend">
                    <div>{orgData.short_name}</div>
                    <div className="box-color" style={{ backgroundColor: orgData.rgb_color }}></div>
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
    );
  }
}

export default CompanyLegend;
