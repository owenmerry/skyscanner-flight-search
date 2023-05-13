import type { SearchSDK } from './flightSDK';
import type { FlightQuery } from '~/types/search';
import { skyscanner } from './flightSDK';
import { waitSeconds } from '~/helpers/utils';

export const getFlightLiveCreate = async ({ apiUrl, query }: { apiUrl: string, query: FlightQuery }): Promise<SearchSDK | { error: string }> => {
    let error: string = `Sorry, something happened and we couldnt do this (code:1def)`;
    let search: SearchSDK | null = null;

    try {
        const res = await fetch(
            `${apiUrl}/create?from=${query.from}&to=${query.to}&depart=${query.depart
            }${query?.return ? `&return=${query.return}` : ""}`
        );
        const json = await res.json();

        if (!json && json.statusCode === 500 && json.statusCode !== 200) {
            error = `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code:2-${json.statusCode})`;
        } else {
            search = skyscanner(json).search();
        }
    } catch (ex) {
        error = `Sorry, something happened and we couldnt do this (code:3catch)`;
    }

    return search ? search : { error };
}

export const getFlightLivePoll = async ({ apiUrl, token, wait }: { apiUrl: string, token: string, wait?: number }): Promise<SearchSDK | { error: string }> => {
    let error: string = `Sorry, something happened and we couldnt do this (code:1def)`;
    let search: SearchSDK | null = null;

    try {
        if (wait) {
            await waitSeconds(wait);
        }
        console.log('poll fetch start...');
        const res = await fetch(
            `${apiUrl}/poll/${token}`
        );
        const json = await res.json();
        console.log('poll fetch ended...', json);

        if (!json && json.statusCode === 500 && json.statusCode !== 200 || Object.keys(json?.content?.results?.itineraries).length === 0) {
            if (Object.keys(json?.content?.results?.itineraries).length === 0) console.log('no results found for session token', token);
            error = `Sorry, something happened and we couldnt do this search, maybe try a differnt search (code:2)`;
        } else {
            search = skyscanner(json).search();
        }
    } catch (ex) {
        error = `Sorry, something happened and we couldnt do this (code:3catch)`;
        console.log(ex);
    }

    return search ? search : { error };
}