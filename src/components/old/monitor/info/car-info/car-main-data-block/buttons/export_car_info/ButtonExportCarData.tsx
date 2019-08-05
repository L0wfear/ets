import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as jsPDF from 'jspdf';
import { useSelector, useDispatch } from 'react-redux';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { getDateWithMoscowTz, getFormattedDateTime } from 'components/@next/@utils/dates/dates';
import { getTextCanvas, getCanvasOfElement } from 'utils/functions';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { NO_DATA_TEXT } from 'constants/statuses';

type Props = {
  disabled: boolean;
};

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

const editParam = 4 * window.devicePixelRatio;

const ButtonExportCarData: React.FC<Props> = React.memo(
  (props) => {

  const type_image_name = useSelector(
    (state: ReduxState) => get(getMonitorPageState(state).carActualGpsNumberIndex[getMonitorPageState(state).carInfo.gps_code], 'type_image_name', ''),
  );

  const date_start = useSelector(
    (state: ReduxState) => getMonitorPageState(state).carInfo.date_start,
  );
  const date_end = useSelector(
    (state: ReduxState) => getMonitorPageState(state).carInfo.date_end,
  );

  const dispatch = useDispatch();

  const handleClick = React.useCallback(
    () => {
      const loadPdf = async () => {
        const doc = new jsPDF() as DocExportCar;
        doc.__page_data = [
          {
            orientation: 'portrait',
          },
        ];

        /**************** MAIN_INFO ****************/
        let topPadding = 10;

        topPadding += 10;

        const [
          canvas_text,
          canvas_car_main_data,
          canvas_img_car,
          canvas_mission_text,
          canvas_on_interval_text,
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
        ]);
        const missions = Array.from(document.querySelectorAll('.car_info_mission_container'));
        const arrCanvasMissionData = await Promise.all(
          missions.length
            ? missions.map(
              (element: HTMLElement) => getCanvasOfElement(element),
            )
            : [
              getTextCanvas(NO_DATA_TEXT, 'font-size:12px'),
            ],
        );

        doc.addImage(
          canvas_text.toDataURL('image/png'),
          'JPEG',
          10,
          topPadding,
          canvas_text.width / editParam,
          canvas_text.height / editParam,
        );

        topPadding += canvas_text.height / editParam;
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
              topPadding = 15;
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
        topPadding = 15;
        const canvas_fuel_chart = await getCanvasOfElement(document.getElementById('fuel-chart'));

        const canvasChart = document.createElement('canvas');
        const tnCanvasContext = canvasChart.getContext('2d');
        canvasChart.width = canvas_fuel_chart.width;
        canvasChart.height = canvas_fuel_chart.height - 100 * window.devicePixelRatio;

        tnCanvasContext.drawImage(canvas_fuel_chart, 0, 0,  canvasChart.width * window.devicePixelRatio, canvasChart.height * window.devicePixelRatio, 0, 0, canvasChart.width, canvasChart.height);

        doc.addImage(
          canvasChart.toDataURL('image/png'),
          'JPEG',
          10,
          topPadding,
          canvasChart.width / editParam,
          canvasChart.height / editParam,
        );

        topPadding += canvas_fuel_chart.height / editParam + 5;
        const canvas_speed_chart = await getCanvasOfElement(document.getElementById('speed-chart'));

        doc.addImage(
          canvas_speed_chart.toDataURL('image/png'),
          'JPEG',
          10,
          topPadding,
          canvas_speed_chart.width / editParam,
          canvas_speed_chart.height / editParam,
        );
        /**************** TRACK_DATA ****************/
        docAddPage(doc, 'landscape');
        topPadding = 15;

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

        doc.save('test.pdf');
      };

      etsLoadingCounter(
        dispatch,
        loadPdf(),
        {
          page: 'main',
        },
      );
    },
    [type_image_name, date_start, date_end],
  );

  return React.useMemo(
    () => (
      <EtsBootstrap.Button disabled={props.disabled} onClick={handleClick} className="all-width">
        <EtsBootstrap.Glyphicon glyph="download-alt" className="car_info-main_block-button" />
        Выгрузить
      </EtsBootstrap.Button>
    ),
    [props.disabled, handleClick],
  );
  },
);

export default ButtonExportCarData;
