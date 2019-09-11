import * as React from 'react';
import { cloneDeep } from 'lodash';
import rWithP from 'constants/routerAndPermission';
import { PageMenuMainDl } from 'components/new/ui/app_header/desktop/left/page_menu/styled/index';
import MainMenuItem from 'components/new/ui/app_header/desktop/left/page_menu/MainMenuItem';
import { getChildrenData } from 'utils/routes/getChildrenData';

const checkVisibleByWidth = (widthAndShowByKey, width) => {
  const widthAndShowByKeyNew = {};
  const hiddenChildren = {};

  Object.entries(widthAndShowByKey).reduce((lastWidth: any, [keyName, data]: any) => {
    widthAndShowByKeyNew[keyName] = {
      ...data,
      show: (lastWidth + data.width) < width,
      position: (lastWidth + data.width) > width / 2 ? 'bottom_left' : 'default',
    };

    if (!widthAndShowByKeyNew[keyName].show) {
      hiddenChildren[keyName] = {
        ...rWithP[keyName],
      };
    }

    return lastWidth + data.width;
  }, 120);

  return {
    widthAndShowByKey: widthAndShowByKeyNew,
    hiddenChildren,
  };
};

class PageMenu extends React.Component<any, any> {
  state = {
    hasHidden: false,
    widthAndShowByKey: Object.keys(rWithP).reduce((newObj, key) => {
      newObj[key] = {
        show: true,
        width: 0,
        position: 'default',
      };

      return newObj;
    }, {}),
    widthAndShowByKeyHidden: {
      hidden: {
        title: 'Ещё',
        children: {},
        permissions: {
          list: true,
        },
      },
    },
  };

  componentDidUpdate(prevProps) {
    if (prevProps.permittedWidth !== this.props.permittedWidth) {
      this.setState((state) => {
        const {
          widthAndShowByKey,
          hiddenChildren,
        } = checkVisibleByWidth(
          cloneDeep(state.widthAndShowByKey),
          this.props.permittedWidth,
        );

        return {
          widthAndShowByKey,
          widthAndShowByKeyHidden: {
            hidden: {
              ...state.widthAndShowByKeyHidden.hidden,
              children: hiddenChildren,
              ...getChildrenData(hiddenChildren),
            },
          },
        };
      });
    }
  }

  changeWidthByKeyName = (keyName, width) => {
    this.setState((state) => {
      const widthAndShowByKeyRaw = cloneDeep(state.widthAndShowByKey);

      widthAndShowByKeyRaw[keyName].width = width;
      const {
        widthAndShowByKey,
        hiddenChildren,
      } = checkVisibleByWidth(
        widthAndShowByKeyRaw,
        this.props.permittedWidth,
      );

      return {
        widthAndShowByKey,
        widthAndShowByKeyHidden: {
          hidden: {
            ...state.widthAndShowByKeyHidden.hidden,
            children: hiddenChildren,
            ...getChildrenData(hiddenChildren),
          },
        },
      };
    });
  }

  mapFirstLvl = ([keyName, data]) => {
    return (
      <MainMenuItem
        key={keyName}
        keyName={keyName}
        data={rWithP[keyName]}
        statusShow={data.show}
        changeWidthByKeyName={this.changeWidthByKeyName}
        position={data.position}
        positionChildren={data.position === 'bottom_left' ? 'left' : 'right'}
      />
    );
  }

  mapFirstLvlHidden = ([keyName, data]) => {
    return (
      <MainMenuItem
        key={keyName}
        keyName={keyName}
        data={data}
        statusShow
        position="bottom_left"
        positionChildren="left"
      />
    );
  }

  render() {
    return (
      <PageMenuMainDl>
        {
          Object.entries(this.state.widthAndShowByKey).map(this.mapFirstLvl)
        }
        {
          Boolean(Object.values(this.state.widthAndShowByKeyHidden.hidden.children)[1]) && (
            Object.entries(this.state.widthAndShowByKeyHidden).map(this.mapFirstLvlHidden)
          )
        }
      </PageMenuMainDl>
    );
  }
}

export default PageMenu;
