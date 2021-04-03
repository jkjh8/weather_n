import net from 'net'
import db from './db'

const clients = []
/* db */
const server = net.createServer((client) => {
  client.on('data', (data) => {
    console.log(data)
  })
  client.on('end', () => {
    clients.splice(clients.indexOf(client), 1)
  })
})

server.addListener('connection', (c) => {
  clients.push(c)
})

async function startServer () {
  let port = await db.setup.find({ id: 'socketport' })
  if (!port) {
    port = 9999
  }
  server.listen(port, () => {
    console.log('Server listening: ' + JSON.stringify(server.address()))
    server.on('close', () => {
      console.log('Server Closed')
    })
    server.on('error', (err) => {
      console.log('Server Error: ', JSON.stringify(err))
    })
  })
}

function brocastMessage (data) {
  clients.forEach(c => {
    c.write(data)
  })
}

startServer()
