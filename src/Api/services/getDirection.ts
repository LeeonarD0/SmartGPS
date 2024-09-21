import { LatLng, TransitMode } from "@googlemaps/google-maps-services-js";
import { client } from "../loadClient";
import 'dotenv/config'

export async function getDirection(origin: LatLng, destination: LatLng, transitMode: TransitMode[]) {
    const keyApi = process.env.API_KEY

    if (!keyApi) {
        throw new Error('Api Invalid !')
    }

    const { data } = await client.directions({
        params: {
            key: keyApi,
            origin,
            destination,
        }
    })


    return data
}