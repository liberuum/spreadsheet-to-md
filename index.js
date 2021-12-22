import Processor from './processor.js'
import CrunchData from './crunchData.js';
import MdExporter from './mdExporter.js';

const processor = new Processor();
await processor.getRawData()
processor.processData()
await processor.addDataToDb()

const crunchData = new CrunchData();
await crunchData.fetchDbData();
crunchData.crunchData();
await crunchData.uploadData()

const mdExporter = new MdExporter(crunchData.expenseTags);
await mdExporter.fetchActuals();
mdExporter.buildTableRowObject();
mdExporter.exportToMd();
