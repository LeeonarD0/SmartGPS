import express from "express";
import { getGeoCoded } from "./Api/services/geoCoded";
import { getDirection } from "./Api/services/getDirection";
import { z } from 'zod'
import { TravelMode } from "@googlemaps/google-maps-services-js";

export const app = express();

app.use(express.json()) // To read json requisition



app.get('/', async (req, res) => {

  const GpsBodySchema = z.object({
    origin: z.string(),
    destination: z.string(),
    KmPerLiter: z.number(),
    bussTicket: z.number(),
    trainTicket: z.number(),
    haveBike: z.string()
  })


  const { origin, destination, KmPerLiter, bussTicket, trainTicket, haveBike } = GpsBodySchema.parse(req.body) // Todo: fix travelMode to accept only the TravelMode and TransitMode[] enum

  const originLatlng = await getGeoCoded(origin)
  const destinationLatLng = await getGeoCoded(destination)

  const { legs } = await getDirection(originLatlng, destinationLatLng)

  const travelDurationInSeconds = legs[0].duration.value


  if (travelDurationInSeconds < 1500) {
    const travelModeBike = await getDirection(originLatlng, destinationLatLng, TravelMode.walking)
    const timeToGetThere = travelModeBike.legs[0].duration.value / 60
    res.send({
      Message: 'For the time obtained, I realize it`s worth walking.',
      DurationTime: `${Math.round(timeToGetThere)} Minutes`
    })

  } else if (travelDurationInSeconds > 1500) {
    res.send('Loading...')
  }

})
