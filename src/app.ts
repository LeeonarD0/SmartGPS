import express from "express";
import { getGeoCoded } from "./Api/services/geoCoded";
import { getDirection } from "./Api/services/getDirection";

export const app = express();

app.use(express.json()) // To read json requisition

app.get('/', async (req, res) => {

  const { origin, destination, transitMode } = req.body

  const originLatlng = await getGeoCoded(origin)
  const destinationLatLng = await getGeoCoded(destination)

  const direction = await getDirection(originLatlng, destinationLatLng, transitMode )

  
  res.send(direction)
})
