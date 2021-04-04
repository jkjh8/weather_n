import net from 'net'
import db from './db'

const clients = []
/* db */
const server = net.createServer((client) => {
  client.on('data', async (data) => {
    const req = data.toString()
    console.log(req)
    if (req === 'get') {
      const r = await db.weather.findOne({ id: 'weatherSumm' })
      const rt = `time:${r.value.time},pty:${r.value.PTY},reh:${r.value.REH},rn1:${r.value.RN1},t1h:${r.value.T1H},uuu:${r.value.UUU},vec:${r.value.VEC},vvv:${r.value.VVV},wsd:${r.value.WSD}`
      client.write(rt)
    }
  })
  client.on('end', () => {
    clients.splice(clients.indexOf(client), 1)
  })
})

server.addListener('connection', (c) => {
  clients.push(c)
})

async function startServer () {
  let port
  const r = await db.setup.findOne({ id: 'socketport' })
  r ? port = r.value : port = 19999
  console.log(port)
  server.listen(port, () => {
    console.log('Server listening: ' + port)
    server.on('close', () => {
      console.log('Server Closed')
    })
    server.on('error', (err) => {
      console.log('Server Error: ', err)
    })
  })
}

function brocastMessage (data) {
  clients.forEach(c => {
    c.write(data)
  })
}

startServer()
