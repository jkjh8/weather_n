import db from './db'

export default async function (id) {
  let rw = await db.weather.findOne({ id: 'weatherSumm' })
  let rd = await db.dust.findOne({ id: 'dust' })
  rw = rw.value
  rd = rd.value
  switch (id) {
    case 'get': {
      const rtw = `timeweather:${rw.time},pty:${rw.PTY},reh:${rw.REH},rn1:${rw.RN1},t1h:${rw.T1H},uuu:${rw.UUU},vec:${rw.VEC},vvv:${rw.VVV},wsd:${rw.WSD}`
      const rtd = `timedust:${rd.dataTime},cograde:${rd.coGrade},covalue:${rd.coValue},khaigrade:${rd.khaiGrade},khaivalue:${rd.khaiValue},no2grade:${rd.no2Grade},no2value:${rd.no2Value},o3grade:${rd.o3Grade},o3value:${rd.o3Value},pm10grade:${rd.pm10Grade},pm10value:${rd.pm10Value},pm25grade:${rd.pm25Grade},pm25value:${rd.pm25Value}`
      console.log(rw, rd)
      return `${rtw},${rtd}`
    }
  }
}
