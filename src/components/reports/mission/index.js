/**
 * @module components/reports/mission
 * Компоненты отчетов по Заданиям
 * all - все отчеты
 * single - отчет по конкретному заданию, выбранный из списка всех отчетов
 * singleByDT - отчет по конкретному заданию в разрезе ДТ
 * singleByODH - отчет по конкретному заданию в разрезе ОДХ
 * singleByPoints - отчет по конкретному заданию в разрезе Пунктов назначения
 */
import all from './MissionReports.jsx';
import single from './MissionReport.jsx';
import singleByDT from './MissionReportByDT.jsx';
import singleByODH from './MissionReportByODH.jsx';
import singleByPoints from './MissionReportByPoints.jsx';

export {
  all,
  single,
  singleByDT,
  singleByODH,
  singleByPoints,
};
