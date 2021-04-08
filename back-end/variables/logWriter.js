const accountabilityLog = './logs/accountabilityLog.txt'
const fs = require('fs')

const writeToFile = (date, action, user) => {
  fs.appendFile(
    accountabilityLog,
    `[${date}] ${action} by ${user}\n`,
    'utf8',
    () => {},
  )
}

module.exports = writeToFile
