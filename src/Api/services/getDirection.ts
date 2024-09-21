import { LatLng,  TransitMode, TravelMode } from "@googlemaps/google-maps-services-js";
import { client } from "../loadClient";
import 'dotenv/config'

export async function getDirection(origin: LatLng, destination: LatLng, travelMode?: TravelMode) {
    const key = process.env.API_KEY

    if (!key) {
        throw new Error('Api Invalid !')
    }

    const { data } = await client.directions({
        params: {
            key,
            origin,
            destination,
            mode: travelMode
        }
    })


    return data.routes[0]
}