import net from 'net'
import db from './db'
import api from './dataApi'

const clients = []
const server = net.createServer((client) => {
  client.on('data', async (data) => {
    const req = data.toString()
    const r = await api(req.toLowerCase())
    client.write(r)
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
