import * as XLSX from 'xlsx';
import {fixDatesInObject} from "../../../utils/types";

export function excelToJson (file) {
  // console.log(`excelToJson: ${file}`);

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      const bStr = e.target.result;

      const sheetJsons = [];

      const readOptions = {
        type: 'binary',
        cellText: false,
        cellDates: true
      };
      const wb = XLSX.read(bStr, readOptions);
      wb.SheetNames.forEach((sheetName) => {
        const ws = wb.Sheets[sheetName];
        // We will get dates as string as what is visible
        const data = XLSX.utils.sheet_to_json(ws, );
        const dataAdjustedDates = data.map(item => fixDatesInObject(item));
        console.log(JSON.stringify(dataAdjustedDates, null, 2));

        const sheetObj = {
          sheetName,
          data:dataAdjustedDates
        }

        sheetJsons.push(sheetObj);
      })

      resolve(sheetJsons);
    }

    fileReader.onerror = function (e) {
      console.log('Error reading excel file')
    }

    // We are reading an uploaded file
    fileReader.readAsBinaryString(file);
  });
}

export function  exportJsonToExcel(json, fileName='', header) {
  const dataType = 'application/vnd.ms-excel';
  const ws = XLSX.utils.json_to_sheet(json, {header});
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'test');
  XLSX.writeFile(wb, fileName);
}