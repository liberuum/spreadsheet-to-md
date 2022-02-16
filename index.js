import Processor from './processor.js'
import CrunchData from './crunchData.js';
import MdExporter from './mdExporter.js';

const processor = new Processor();
await processor.getRawData()
processor.processData()
// console.log('filteredByMonth', processor.filteredByMonth)

const crunchData = new CrunchData();
crunchData.getData(processor.filteredByMonth['June 2021'])
crunchData.crunchData();
console.log('actuals', crunchData.actuals)

// const mdExporter = new MdExporter(crunchData.expenseTags);
// await mdExporter.fetchActuals();
// mdExporter.buildTableRowObject();
// mdExporter.exportToMd();
