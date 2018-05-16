import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';
import { FluxContext } from 'utils/decorators';

import { getIsShowAllGeometry } from 'redux/selectors/toolbar';
import { toggleShowAllGeometry } from 'redux/modules/toolbar';

import * as Options from 'components/monitor/toolbarTSX/items/GeoObjectLegend/Options';

import Div from 'components/ui/Div';

import { GEOOBJECTS_LIST } from 'constants/geoobjects';

const createValidOptionsName = name =>
  name.split('_').map(p =>
    `${p[0].toLocaleUpperCase()}${p.slice(1)}`).join('');

const options = GEOOBJECTS_LIST.reduce((newArr, key) => {
  const ComponentType = Options[createValidOptionsName(key)];

  newArr.push({
    key,
    Component: ComponentType,
  });

  return newArr;
}, []);

@connect(
  state => ({
    isActive: getIsShowAllGeometry(state),
  }),
  {
    toggleShowAllGeometry,
  },
)
@FluxContext
class GeoObjectLegend extends React.Component<any, any> {
  constructor(props, context) {
    super(props);

    this.state = {
      showAll: false,
      permitedOptions: options.filter(({key}) => context.flux.getStore('session').getPermission(`${key}.list`)),
    };
  }

  handleClickTitle = () => {
    this.setState({ showAll: !this.state.showAll });
  }

  onClickCheckbox = () => {
    const { isActive } = this.props;

    this.props.toggleShowAllGeometry(!isActive);
  }

  render() {
    const { showAll, permitedOptions } = this.state;
    const { isActive } = this.props;
    const mainClassName = cx('app-toolbar-fill', 'app-toolbar-show-geoobjects', showAll ? 'show-options' : 'hide-options');

    return (
      <div className={mainClassName}>
        <div className="status-filter_options option-with-checkbox">
          <input type="checkbox" checked={isActive} onClick={this.onClickCheckbox}/>
          <span className="toolbar-with-checkbox" onClick={this.handleClickTitle}>{`Геообъекты ${showAll ? '▼' : '►'}`}</span>
        </div>
        <Div hidden={!showAll} className="toolbar-children">
          {
            permitedOptions.map(({ Component }, i) => <Component key={i} />)
          }
        </Div>
      </div>
    );
  }
}

export default GeoObjectLegend;
