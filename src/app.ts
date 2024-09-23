import express from "express";
import { z } from 'zod'
import { getGeoCoded } from "./Api/services/geoCoded";
import { getDirection } from "./Api/services/getDirection";
import { TravelMode } from "@googlemaps/google-maps-services-js";

export const app = express();


app.use(express.json()) // To read json requisition



app.get('/', async (req, res) => {

  const GpsBodySchema = z.object({
    origin: z.string(),
    destination: z.string(),
    KmPerLiter: z.number(),
    ValuePerLiter: z.number(),
    bussTicket: z.number(),
    trainTicket: z.number(),
    haveBike: z.enum(['yes', 'no'])
  })

  
  const { origin, destination, KmPerLiter, ValuePerLiter, bussTicket, trainTicket, haveBike } = GpsBodySchema.parse(req.body) // Todo: fix travelMode to accept only the TravelMode and TransitMode[] enum

 
  const originLatlng = await getGeoCoded(origin)
  const destinationLatLng = await getGeoCoded(destination)

  // === WALINKING MODE  === //
  const travelModeWalking = await getDirection(originLatlng, destinationLatLng, TravelMode.walking)
  const timeDurationWalking = travelModeWalking.legs[0].duration.value / 60

  // === BYCICLING MODE == //

  const travelModeBicycling = await getDirection(originLatlng, destinationLatLng, TravelMode.bicycling)
  const timeDurationBicyling = travelModeBicycling.legs[0].duration.value / 60
  

  if (timeDurationWalking < 15) {  
    res.send({
      Message: 'For the time obtained, I realize it`s worth walking.',
      DurationTime: `${Math.round(timeDurationWalking)}~ Minutes`
    })

  } else if (haveBike === 'yes' && timeDurationBicyling < 15) {
    res.send({
      message: 'For the time obtained, I realize it`s worth Bicycling.',
      DurationTime: `${Math.round(timeDurationBicyling)}~ Minutes`
    })
  } else {
    KmPerLiter // how many km your car does with 1 liter
    ValuePerLiter // How much cost the petrol per liter
    const totCarConsume = 5 * 23
  }
})
