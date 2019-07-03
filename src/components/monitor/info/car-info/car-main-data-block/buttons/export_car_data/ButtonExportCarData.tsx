import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as jsPDF from 'jspdf';
import { useSelector } from 'react-redux';
import { getMonitorPageState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { getDateWithMoscowTz, getFormattedDateTime } from 'utils/dates';
import { getTextCanvas, getCanvasOfElement } from 'utils/functions';

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

const editParam = 4 * window.devicePixelRatio;

const ButtonExportCarData: React.FC<Props> = React.memo(
  (props) => {

  const type_image_name = useSelector(
    (state: ReduxState) => get(getMonitorPageState(state).carActualGpsNumberIndex[getMonitorPageState(state).carInfo.gps_code], 'type_image_name', ''),
  );

  const handleClick = React.useCallback(
    async () => {
      const doc = new jsPDF();

      // заголовок
      const canvas_createAt = await getTextCanvas(`Сформировано: ${getFormattedDateTime(getDateWithMoscowTz())}`, 'font-size:10px');

      /* 1 страница */
      doc.addImage(
        canvas_createAt.toDataURL('image/png'),
        'JPEG',
        format.a4.width - canvas_createAt.width / editParam - 10,
        5,
        canvas_createAt.width / editParam,
        canvas_createAt.height / editParam,
      );

      const canvas_text = await getTextCanvas('Информация о ТС:', 'font-size:14px; font-weight:800');
      doc.addImage(
        canvas_text.toDataURL('image/png'),
        'JPEG',
        10,
        10,
        canvas_text.width / editParam,
        canvas_text.height / editParam,
      );

      const canvas_car_main_data = await getCanvasOfElement(document.getElementById('car_main_data'));
      doc.addImage(
        canvas_car_main_data.toDataURL('image/png'),
        'JPEG',
        10,
        10 + canvas_text.height / editParam,
        canvas_car_main_data.width / editParam,
        canvas_car_main_data.height / editParam,
      );

      if (type_image_name) {
        const canvas_img_car = await getCanvasOfElement(document.getElementById('car_info_image'));
        document.body.appendChild(canvas_img_car);
        doc.addImage(
          canvas_img_car.toDataURL('image/png'),
          'JPEG',
          10 + canvas_car_main_data.width / editParam,
          10 + canvas_text.height / editParam + canvas_car_main_data.height / editParam / 2 - canvas_img_car.height / editParam / 2,
          canvas_img_car.width / editParam,
          canvas_img_car.height / editParam,
        );
      }

      doc.line(
        10,
        10 + canvas_text.height / editParam + canvas_car_main_data.height / editParam + 5,
        format.a4.width - 10,
        10 + canvas_text.height / editParam + canvas_car_main_data.height / editParam + 5,
      ); // horizontal line

      // шаблон под нумерацию страниц
      doc.addImage(
        canvas_createAt.toDataURL('image/png'),
        'JPEG',
        format.a4.width - canvas_createAt.width / editParam - 10,
        format.a4.height - canvas_createAt.height / editParam - 5,
        canvas_createAt.width / editParam,
        canvas_createAt.height / editParam,
      );

      doc.addPage('a4');
      doc.addImage(
        canvas_createAt.toDataURL('image/png'),
        'JPEG',
        210 - canvas_createAt.width / editParam - 10,
        5,
        canvas_createAt.width / editParam,
        canvas_createAt.height / editParam,
      );

      doc.save('test.pdf');
    },
    [type_image_name],
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
