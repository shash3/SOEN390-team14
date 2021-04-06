/* eslint-disable no-undef */
const xl = require('excel4node')
const FileSaver = require('file-saver')

const saveExcelFile = (wb, filename, extension) => {
  let output = filename
  if (!output.includes('.')) {
    output += extension
  }
  wb.writeToBuffer().then((wbBuffer) => {
    const blob = new Blob([wbBuffer])
    FileSaver.saveAs(blob, output)
  })
}

const createWorkBook = (data, excelSheet) => {
  // Create workbook and worksheet
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet(excelSheet)

  try {
    // Write Data in Excel file
    const totalHeader = []
    for (let index = 0; index < data.length; index+=1) {
      const record = data[index];
      
      // Get all column names (converts from unstructured to structured data format)
      Object.keys(record).forEach(column => {
        if (!totalHeader.includes(column)){
          totalHeader.push(column)
        }
      });

      // Write data to the cell based on column name
      Object.keys(record).forEach((columnName) => {
        const columnIndex = totalHeader.indexOf(columnName)
        if (typeof record[columnName] === 'number') {
          ws.cell(index+2, columnIndex+1).number(record[columnName])
        } else {
          ws.cell(index+2, columnIndex+1).string(record[columnName])
        }
      })

    }

    // Write all column names
    for (let index = 0; index < totalHeader.length; index+=1) {
      const heading = totalHeader[index];
      ws.cell(1, index+1).string(heading)
    }
  } catch (err) {
    console.error('invalid data type when saving to file')
  }

  return wb;
}

/**
 * Exports json data to an MS Excel file.
 * 
 * @param {String} defaultFilename the name of the file name
 * @param {Array} data the array of json data to export
 */
const exportToJsonExcel = (defaultFilename, data) => {
  const extension = '.xlsx'
  const wb = createWorkBook(data, defaultFilename)
  saveExcelFile(wb, defaultFilename, extension)
}

/**
 * Exports json data to a Comma Seperated file.
 * 
 * @param {String} defaultFilename the name of the file name
 * @param {Array} data the array of json data to export
 */
const exportJsonToCSV = (defaultFilename, data) => {
  const extension = '.csv'
  const wb = createWorkBook(data, defaultFilename)
  saveExcelFile(wb, defaultFilename, extension)
}


const exportGraphPDF = (defaultFilename, graphData) => {

}

module.exports = {
  exportToJsonExcel,
  exportJsonToCSV
}
