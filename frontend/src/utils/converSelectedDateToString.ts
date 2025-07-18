import { DateRage } from 'frontend/src/type'

const converSelectedDateToString = ([startDate, endDate]: DateRage) => {
  const dateString =
    (startDate?.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
    }) || '') +
    (endDate
      ? ' - ' +
        endDate?.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
        })
      : '')
  return dateString
}

export default converSelectedDateToString
