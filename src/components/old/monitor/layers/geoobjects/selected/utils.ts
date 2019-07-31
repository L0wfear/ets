import { LayerSelectedGeooobjects } from 'components/old/monitor/layers/geoobjects/selected/LayerSelectedGeooobjects.h';
import { checkShowTrue, checkShowFalse } from 'components/old/monitor/layers/geoobjects/utils';

/**
 * рендер выбранных геообъектов
 * @param selectedGeoobjects текущее состояние выбранные геообъекты
 * @param new_selectedGeoobjects следующее состояние выбранных геообъектов
 * @param thisProps пропсы для работы с ol
 */
export const renderGeoobjects: LayerSelectedGeooobjects.renderGeoobjectsFunc = (selectedGeoobjects, new_selectedGeoobjects, thisProps) => {
  for (const serverName in new_selectedGeoobjects) {
    if (serverName in new_selectedGeoobjects) {
      const iterableData = new_selectedGeoobjects[serverName];

      for (const id in iterableData) {
        if (id in iterableData) {
          const oldFeature = thisProps.getFeatureById(id);
          const data = iterableData[id];
          const { front_show } = data;

          checkShowTrue(serverName, id, front_show, data, selectedGeoobjects[serverName][id], oldFeature, thisProps, true);
          checkShowFalse(front_show, oldFeature, thisProps);
        }
      }
    }
  }
};
