import * as React from 'react';
import { get } from 'lodash';
import * as jsPDF from 'jspdf';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { getDateWithMoscowTz, getFormattedDateTime } from 'components/@next/@utils/dates/dates';
import { getTextCanvas, getCanvasOfElement, get_browser } from 'utils/functions';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { NO_DATA_TEXT } from 'constants/statuses';
import HiddenMapCarExport from 'components/old/monitor/info/car-info/car-main-data-block/buttons/export_car_info/map/HiddenMapCarExport';
import withMapInConsumer from 'components/new/ui/map/context/withMapInConsumer';
import { GetMapImageInBase64ByKeyType } from 'components/new/ui/map/context/MapetsContext.h';
import { getDistanceValue } from 'components/old/monitor/info/car-info/car-tab-menu/car-track-information/title-track-tab/DistanceAggValue';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

type Props = ({
  disabled: boolean;
  getMapImageInBase64ByKey: GetMapImageInBase64ByKeyType,
}) & WithSearchProps;

// в мм
const format = {
  a4: {
    width: 210,
    height: 297,
  },
};

type DocExportCar = jsPDF & {
  __page_data: Array<{
    orientation: 'portrait'|'landscape',
  }>;
};

const docAddPage = (doc: DocExportCar, orientation?: 'portrait' | 'landscape') => {
  doc.addPage('a4', orientation);
  doc.__page_data.push({
    orientation: orientation || 'portrait',
  });

  return doc;
};

const editParam = 4 * 2;

const mapKey = 'HiddenMapCarExport';

const ButtonExportCarData: React.FC<Props> = React.memo(
  (props) => {

  const type_image_name = etsUseSelector((state) => get(getMonitorPageState(state).carActualGpsNumberIndex[getMonitorPageState(state).carInfo.gps_code], 'type_image_name', ''));

  const date_start: string = props.searchState.date_start;
  const date_end: string = props.searchState.date_end;

  const distance = etsUseSelector(
    (state) => getMonitorPageState(state).carInfo.trackCaching.distance,
  );
  const gov_number = etsUseSelector(
    (state) => getMonitorPageState(state).carInfo.gov_number,
  );

  const inLoading = etsUseSelector(
    (state) => {
      return (getMonitorPageState(state).carInfo.trackCaching.track === -1
        || getMonitorPageState(state).carInfo.missionsData.missions === -1);
    },
  );

  const dispatch = etsUseDispatch();
  const [ currentBrowser, setCurrentBrowser] = React.useState('');
  React.useEffect(() => {
    setCurrentBrowser(get_browser().name);
  }, [] );

  const handleClick = React.useCallback(
    () => {
      const loadPdf = async () => {
        try {
          const doc = new jsPDF() as DocExportCar;
          doc.__page_data = [
            {
              orientation: 'portrait',
            },
          ];

          /**************** MAIN_INFO ****************/
          // PAGE 1
          let topPadding = 20;

          const [
            canvas_text,
            canvas_car_main_data,
            canvas_img_car,
            canvas_mission_text,
            canvas_on_interval_text,
            arrCanvasMissionData,
            canvas_no_data,
          ] = await Promise.all([
            getTextCanvas('Информация о ТС:', 'font-size:14px; font-weight:800'),
            getCanvasOfElement(document.getElementById('car_main_data')),
            Promise.resolve().then(
              () => {
                if (type_image_name) {
                  return getCanvasOfElement(document.getElementById('car_info_image'));
                }
              },
            ),
            getTextCanvas('Задания:', 'font-size:14px; font-weight:800'),
            getTextCanvas(`За период: ${getFormattedDateTime(date_start)} - ${getFormattedDateTime(date_end)}`, 'font-size:14px;'),
            Promise.resolve().then(
              () => {
                const missions = Array.from(document.querySelectorAll('.car_info_mission_container'));
                return Promise.all(
                  missions.length
                    ? missions.map(
                      (element: HTMLElement) => getCanvasOfElement(element),
                    )
                    : [
                      getTextCanvas(NO_DATA_TEXT, 'font-size:12px'),
                    ],
                );
              },
            ),
            getTextCanvas(NO_DATA_TEXT, 'font-size:12px'),
          ]);
          // Вставляет текст
          doc.addImage(
            canvas_text.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_text.width / editParam,
            canvas_text.height / editParam,
          );

          topPadding += canvas_text.height / editParam;

          // Данные тачки
          doc.addImage(
            canvas_car_main_data.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_car_main_data.width / editParam,
            canvas_car_main_data.height / editParam,
          );

          if (canvas_img_car) {
            doc.addImage(
              canvas_img_car.toDataURL('image/png'),
              'JPEG',
              10 + canvas_car_main_data.width / editParam,
              topPadding + canvas_car_main_data.height / editParam / 2 - canvas_img_car.height / editParam / 2,
              canvas_img_car.width / editParam,
              canvas_img_car.height / editParam,
            );
          }

          topPadding +=  canvas_car_main_data.height / editParam + 5;

          doc.line(
            10,
            topPadding,
            format.a4.width - 10,
            topPadding,
          ); // horizontal line

          topPadding += 5;

          // Задания слово
          doc.addImage(
            canvas_mission_text.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_mission_text.width / editParam,
            canvas_mission_text.height / editParam,
          );

          topPadding += canvas_mission_text.height / editParam + 2;

          doc.addImage(
            canvas_on_interval_text.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_on_interval_text.width / editParam,
            canvas_on_interval_text.height / editParam,
          );

          topPadding += canvas_on_interval_text.height / editParam + 2;

          const lastPosition = format.a4.height - 15;

          arrCanvasMissionData.forEach(
            (canvasMissionData) => {
              const canvasHeight = canvasMissionData.height / editParam;

              if (topPadding + canvasHeight + 2  > lastPosition) {
                docAddPage(doc);
                topPadding = 20;
              }
              doc.addImage(
                canvasMissionData.toDataURL('image/png'),
                'JPEG',
                15,
                topPadding,
                canvasMissionData.width / editParam,
                canvasHeight,
              );

              topPadding += canvasHeight + 2;
            },
          );

          /**************** CHARTS ****************/
          docAddPage(doc, 'landscape');
          topPadding = 20;

          const [
            canvas_text_fuel,
            canvas_text_speed,
            canvas_fuel_chart,
            canvas_car_info_event_table,
            canvas_speed_chart,
          ] = await Promise.all([
            getTextCanvas('Датчики топлива:', 'font-size:14px; font-weight:800'),
            getTextCanvas('Датчики скорости:', 'font-size:14px; font-weight:800'),
            Promise.resolve().then(
              () => {
                const fuelChart = document.getElementById('fuel-chart');
                if (fuelChart) {
                  return getCanvasOfElement(fuelChart);
                } else {
                  return null;
                }
              },
            ),
            Promise.resolve().then(
              () => {
                const carInfoEventTable = document.getElementById('car_info-event_table');

                if (carInfoEventTable) {
                  return getCanvasOfElement(carInfoEventTable);
                }

                return null;
              },
            ),
            Promise.resolve().then(
              () => {
                const speedChart = document.getElementById('speed-chart');

                if (speedChart) {
                  return getCanvasOfElement(speedChart);
                }
                return null;
              },
            ),
          ]);
          doc.addImage(
            canvas_text_fuel.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_text_fuel.width / editParam,
            canvas_text_fuel.height / editParam,
          );
          topPadding += canvas_text_fuel.height / editParam;

          if (canvas_fuel_chart) {
            const canvasChart = document.createElement('canvas');
            canvasChart.width = canvas_fuel_chart.width;
            canvasChart.height = canvas_fuel_chart.height - 350 / (2 / window.devicePixelRatio);

            canvasChart.getContext('2d').drawImage(
              canvas_fuel_chart,
              0,
              0,
              canvasChart.width,
              canvasChart.height,
              0,
              0,
              canvasChart.width,
              canvasChart.height,
            );

            doc.addImage(
              canvasChart.toDataURL('image/png'),
              'JPEG',
              10,
              topPadding,
              canvasChart.width / editParam,
              canvasChart.height / editParam,
            );

            const canvasLegendChart = document.createElement('canvas');
            canvasLegendChart.width = canvas_fuel_chart.width;
            canvasLegendChart.height = 200;

            canvasLegendChart.getContext('2d').drawImage(
              canvas_fuel_chart,
              0,
              canvas_fuel_chart.height - 350,
              canvasLegendChart.width,
              canvasLegendChart.height,
              0,
              0,
              canvasLegendChart.width,
              canvasLegendChart.height,
            );

            doc.addImage(
              canvasLegendChart.toDataURL('image/png'),
              'JPEG',
              canvasChart.width / editParam + 10,
              topPadding,
              canvasLegendChart.width / editParam,
              canvasLegendChart.height / editParam,
            );

            if (canvas_car_info_event_table) {
              doc.addImage(
                canvas_car_info_event_table.toDataURL('image/png'),
                'JPEG',
                format.a4.height - canvas_car_info_event_table.width / editParam - 10,
                topPadding,
                canvas_car_info_event_table.width / editParam,
                canvas_car_info_event_table.height / editParam,
              );
            }
            topPadding += canvasChart.height / editParam + 5;
          } else {
            doc.addImage(
              canvas_no_data.toDataURL('image/png'),
              'JPEG',
              15,
              topPadding,
              canvas_no_data.width / editParam,
              canvas_no_data.height / editParam,
            );
            topPadding += canvas_no_data.height / editParam + 5;
          }

          doc.addImage(
            canvas_text_speed.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_text_speed.width / editParam,
            canvas_text_speed.height / editParam,
          );
          topPadding += canvas_text_speed.height / editParam;

          if (canvas_speed_chart) {
            const canvasSpeedChart = document.createElement('canvas');
            canvasSpeedChart.width = canvas_speed_chart.width;
            canvasSpeedChart.height = canvas_speed_chart.height - 350;

            canvasSpeedChart.getContext('2d').drawImage(
              canvas_speed_chart,
              0,
              0,
              canvasSpeedChart.width,
              canvasSpeedChart.height,
              0,
              0,
              canvasSpeedChart.width,
              canvasSpeedChart.height,
            );

            doc.addImage(
              canvasSpeedChart.toDataURL('image/png'),
              'JPEG',
              10,
              topPadding,
              canvasSpeedChart.width / editParam,
              canvasSpeedChart.height / editParam,
            );
            const canvasLegendSpeedChart = document.createElement('canvas');
            canvasLegendSpeedChart.width = 380;
            canvasLegendSpeedChart.height = 200;

            canvasLegendSpeedChart.getContext('2d').drawImage(
              canvas_speed_chart,
              0,
              canvas_speed_chart.height - 350,
              canvasLegendSpeedChart.width,
              canvasLegendSpeedChart.height,
              0,
              0,
              canvasLegendSpeedChart.width,
              canvasLegendSpeedChart.height,
            );

            doc.addImage(
              canvasLegendSpeedChart.toDataURL('image/png'),
              'JPEG',
              canvasSpeedChart.width / editParam + 10,
              topPadding,
              canvasLegendSpeedChart.width / editParam,
              canvasLegendSpeedChart.height / editParam,
            );
          } else {
            doc.addImage(
              canvas_no_data.toDataURL('image/png'),
              'JPEG',
              15,
              topPadding,
              canvas_no_data.width / editParam,
              canvas_no_data.height / editParam,
            );
            topPadding += canvas_no_data.height / editParam + 5;
          }

          /**************** TRACK_DATA ****************/
          docAddPage(doc, 'landscape');
          topPadding = 20;

          const [
            { canvas: canvas_map },
            canvas_text_track,
            canvas_text_track_distance,
            canvas_track_sensors_list,
            canvas_car_track_legend,
          ] = await Promise.all([
            props.getMapImageInBase64ByKey(mapKey),
            getTextCanvas('Трекинг:', 'font-size:14px; font-weight:800'),
            getTextCanvas(`Протяженность, км: ${getDistanceValue(distance)}`, 'font-size:14px;'),
            getCanvasOfElement(document.getElementById('track_sensors_list')),
            getCanvasOfElement(document.getElementById('car_track_legend')),
          ]);

          // Слово трекинг
          doc.addImage(
            canvas_text_track.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_text_track.width / editParam,
            canvas_text_track.height / editParam,
          );

          topPadding += canvas_text_track.height / editParam;
          // Протяженность
          doc.addImage(
            canvas_text_track_distance.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_text_track_distance.width / editParam,
            canvas_text_track_distance.height / editParam,
          );

          topPadding += canvas_text_track_distance.height / editParam;

          // карта
          doc.addImage(
            canvas_map.toDataURL('image/png'),
            'JPEG',
            10,
            topPadding,
            canvas_map.width / editParam * (2 / window.devicePixelRatio),
            canvas_map.height / editParam * (2 /  window.devicePixelRatio),
          );
          topPadding += canvas_map.height / editParam * (2 /  window.devicePixelRatio) - canvas_track_sensors_list.height / editParam + 4;
          const leftPadding = 10 + (canvas_map.width / editParam * (2 / window.devicePixelRatio)) + 5;

          // список датчиков
          doc.addImage(
            canvas_track_sensors_list.toDataURL('image/png'),
            'JPEG',
            leftPadding,
            topPadding,
            canvas_track_sensors_list.width / editParam,
            canvas_track_sensors_list.height / editParam,
          );

          // разделитель
          doc.line(
            leftPadding,
            topPadding + 7,
            format.a4.height - 10,
            topPadding + 7,
          ); // horizontal line

          topPadding += -canvas_car_track_legend.height / editParam - 4;

          // legend Image
          doc.addImage(
            canvas_car_track_legend.toDataURL('image/png'),
            'JPEG',
            leftPadding,
            topPadding,
            canvas_car_track_legend.width / editParam,
            canvas_car_track_legend.height / editParam,
          );

          /**************** END ****************/
          const canvas_createAt = await getTextCanvas(`Сформировано: ${getFormattedDateTime(getDateWithMoscowTz())}`, 'font-size:10px');

          for (let i = 0; i < doc.__page_data.length; i++) {
            doc.setPage(i + 1);
            const page_data = doc.__page_data[i];

            const leftOffset = page_data.orientation === 'portrait' ? format.a4.width : format.a4.height;
            const topOffset = page_data.orientation === 'portrait' ? format.a4.height : format.a4.width;

            doc.addImage(
              canvas_createAt.toDataURL('image/png'),
              'JPEG',
              leftOffset - canvas_createAt.width / editParam - 10,
              15,
              canvas_createAt.width / editParam,
              canvas_createAt.height / editParam,
            );

            const page_canvas = await getTextCanvas(`${i + 1}`, 'font-size:12px');

            doc.addImage(
              page_canvas.toDataURL('image/png'),
              'JPEG',
              leftOffset - page_canvas.width / editParam - 10,
              topOffset - page_canvas.height / editParam - 15,
              page_canvas.width / editParam,
              page_canvas.height / editParam,
            );
          }

          doc.save(`Информация о ${gov_number} за ${getFormattedDateTime(date_start)} - ${getFormattedDateTime(date_end)}.pdf`);
        } catch (error) {
          console.log(error); // tslint:disable-line
        }
      };
      etsLoadingCounter(
        dispatch,
        // loadPdf(),
        new Promise(
          (res) => {
            setTimeout(
              async () => {
                try {
                  await loadPdf();
                } catch (error) {
                  //
                }
                res();
              },
              0,
            );
          },
        ),
        {
          page: 'main',
          noTimeout: true,
        },
      );
    },
    [type_image_name, date_start, date_end, distance, gov_number, props.searchState],
  );

  return React.useMemo(
    () => (
      currentBrowser !== 'IE' &&
        <React.Fragment>
          <HiddenMapCarExport width={format.a4.height * 2.5} height={format.a4.width * 2.8} mapKey={mapKey} />
          <EtsBootstrap.Button disabled={props.disabled || inLoading} onClick={handleClick} className="all-width">
            <EtsBootstrap.Glyphicon glyph="download-alt" className="car_info-main_block-button" />
            Выгрузить
          </EtsBootstrap.Button>
        </React.Fragment>
    ),
    [props.disabled, handleClick, inLoading, currentBrowser],
  );
  },
);

// export default withMapInConsumer()(ButtonExportCarData);
export default compose<any, any>(
  withSearch,
  withMapInConsumer(),
)(ButtonExportCarData);
