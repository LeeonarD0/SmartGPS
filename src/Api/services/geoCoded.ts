
import 'dotenv/config'
import { client } from '../loadClient'


export async function getGeoCoded(address: string) {

    const keyApi = process.env.API_KEY

    if (!keyApi) {
        throw new Error('Api Invalid !')
    }
    const { data } = await client.geocode({
        params: {
            key: keyApi,
            address: address,
        }
    })

    return data.results[0].geometry.location
}


