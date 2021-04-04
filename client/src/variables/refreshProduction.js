/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const refreshProduction = () => {
    
  const userToken = JSON.parse(localStorage.getItem('user'))
  const [userLocation, setUserLocation] = useState('')

  // Retrieve values only once.
  useEffect(() => {
    // Retrieve machine location from user
    const getUserLoc = async () => {
      const response = await axios
        .get('/api/auth', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .catch((err) => console.error('Error', err))
    
      if (response && response.data) {
        const user = response.data
        setUserLocation(user.location)
      }
    }
    
    getUserLoc()
  }, [])


  /* ---------------------------
   * Functions To Refresh Production Machines
   * ---------------------------
   */

  const [refreshMachine, setRefreshMachine] = useState(false)
  /**
   * Set a timer to refresh every few seconds.
   */
  useEffect(() => {
    let refresh = false
    const interval = setInterval(() => {
      console.log('pass')
      setRefreshMachine(!refresh)
      refresh = !refresh
    }, 1000 * 5)

    return () => { clearInterval(interval) }
  }, [])

  /**
   * Checks if the machines are finished producing the part. Removes it from the machine and adds it to quality assurance.
   */
  useEffect(async () => {
    const returnUnavailableMachines = () => {
      const reply = axios
        .post(
          '/api/machine/unavailable',
          {
            location: userLocation,
          },
          {
            headers: {
              'x-auth-token': userToken,
            },
          }
        )
        .then((response) => response.data)
        .catch((err) => console.error('Error', err))
      return reply
    }

    const readMachineLog = async () => {
      const reply = await axios
        .get('/api/machine/json', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .catch((err) => console.error('Error', err))
      return reply.data
    }

    const writeMachineLog = async (qualityJson) => {
      await axios
        .post(
          '/api/machine/json',
          {
            data: qualityJson,
          },
          {
            headers: {
              'x-auth-token': userToken,
            },
          }
        )
        .catch((error) => {
          console.error(error)
        })
    }

    const updateMachineLog = async (machineKey, item, date, location) => {
      const machinesLog = await readMachineLog()
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      const year = date.getUTCFullYear()
      const month = monthNames[date.getUTCMonth()]

      if (machinesLog[year] === undefined) {
        machinesLog[year] = {}
      }
      const machineYear = machinesLog[year]

      if (machineYear[month] === undefined) {
        machineYear[month] = {}
      }
      const machineMonth = machineYear[month]

      if (machineMonth[location] === undefined) {
        machineMonth[location] = {}
      }
      const machineLocation = machineMonth[location]

      if (machineLocation[machineKey] === undefined) {
        machineLocation[machineKey] = {
          items: {},
          minutesLogged: 0,
        }
      }
      const machineItems = machineLocation[machineKey].items

      if (machineItems[item] === undefined) {
        machineItems[item] = 0
      }

      machineItems[item] += 1
      machineLocation[machineKey].minutesLogged += 5

      writeMachineLog(machinesLog)
    }

    const addToQuality = async (name, type, location) => {
      await axios
        .post(
          '/api/quality/add',
          {
            name,
            type,
            location,
          },
          {
            headers: {
              'x-auth-token': userToken,
            },
          }
        )
        .catch((error) => {
          console.error(error)
        })
    }

    const removeItemFromMachine = async (key) => {
      await axios
        .put(
          '/api/machine/remove',
          {
            _id: key,
          },
          {
            headers: {
              'x-auth-token': userToken,
            },
          }
        )
        .catch((err) => console.error('Error', err))
    }

    const main = async () => {
      if (userLocation === undefined) {
        return
      }
      let updated = 0
      const unavailMachines = await returnUnavailableMachines()
      for (let index = 0; index < unavailMachines.length; index += 1) {
        const machine = unavailMachines[index]
        if (new Date(machine.finish_time).valueOf() < new Date().valueOf()) {
          await updateMachineLog(
            machine._id,
            machine.item,
            new Date(),
            userLocation
          )
          await addToQuality(machine.item, machine.type, userLocation)
          await removeItemFromMachine(machine._id)
          updated += 1
        }
      }
      if (updated > 0) {
        updateMachineView(!machineView)
      }
    }

    main()
  }, [refreshMachine])

}

export default refreshProduction