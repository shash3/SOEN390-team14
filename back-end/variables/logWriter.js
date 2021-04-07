const accountabilityLog = './logs/accountabilityLog.txt'
const fs = require('fs')

const writeToFile = (date, action, user) => {
  fs.appendFile(
    accountabilityLog,
    `[${date}] ${action} by ${user}`,
    'utf8',
    () => {},
  )
}

module.exports = writeToFile
