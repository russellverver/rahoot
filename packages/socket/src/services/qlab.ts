import dgram from "dgram"

function oscString(str: string): Buffer {
  const len = str.length + 1
  const padded = Math.ceil(len / 4) * 4
  const buf = Buffer.alloc(padded, 0)
  buf.write(str, 0, "ascii")
  return buf
}

function buildOscMessage(address: string): Buffer {
  return Buffer.concat([oscString(address), oscString(",")])
}

export function sendQlabCue(
  questionNumber: number,
  ip: string,
  port: number,
): void {
  const address = `/cue/${questionNumber}/start`
  const message = buildOscMessage(address)

  const client = dgram.createSocket("udp4")
  client.send(message, port, ip, (err) => {
    if (err) {
      console.error(`QLab OSC error: ${err.message}`)
    } else {
      console.log(`QLab OSC sent: ${address} → ${ip}:${port}`)
    }
    client.close()
  })
}
