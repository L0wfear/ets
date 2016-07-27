/**
 * @module components/reports
 * Отчеты
 */
import analytics from './Analytics.jsx';
import coverage from './CoverageReport.jsx';
import fuel from './FuelReport.jsx';
import odh from './ODHReports.jsx';
import mission from './mission';
import route from './route';
import daily from './daily';
import weekly from './weekly';
import odhCoverageReport from './odh_coverage/OdhCoverageReport.jsx';

export default {
  analytics,
  coverage,
  fuel,
  mission,
  odh,
  route,
  daily,
  weekly,
  odhCoverageReport
}
