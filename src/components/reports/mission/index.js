/**
 * @module components/reports/mission
 * Компоненты отчетов по Заданиям
 * all - все отчеты
 * singleByDT - отчет по конкретному заданию в разрезе ДТ
 * singleByODH - отчет по конкретному заданию в разрезе ОДХ
 * singleByPoints - отчет по конкретному заданию в разрезе Пунктов назначения
 */
import all from './MissionReport.jsx';
import singleByDT from './MissionReportByDT.jsx';
import singleByODH from './MissionReportByODH.jsx';
import singleByPoints from './MissionReportByPoints.jsx';

export {
  all,
  singleByDT,
  singleByODH,
  singleByPoints,
};
