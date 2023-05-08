import type { SearchSDK } from './flightSDK';
import type { FlightQuery } from '~/types/search';
import { skyscanner } from './flightSDK';
import { waitSeconds } from '~/helpers/utils';

export const getFlightLiveCreate = async ({ apiUrl, query }: { apiUrl: string, query: FlightQuery }): Promise<SearchSDK | { error: string }> => {
    let error: string = `Sorry, something happened and we couldnt do this`;
    let search: SearchSDK | null = null;

    try {
        const res = await fetch(
            `${apiUrl}/create?from=${query.from}&to=${query.to}&depart=${query.depart
            }${query?.return ? `&return=${query.return}` : ""}`
        );
        const json = await res.json();

        if (!json && json.statusCode === 500 && json.statusCode !== 200) {
            error = `Sorry, something happened and we couldnt do this search, maybe try a differnt search`;
        } else {
            search = skyscanner(json).search();
        }
    } catch (ex) {
        error = `Sorry, something happened and we couldnt do this`;
    }

    return search ? search : { error };
}

export const getFlightLivePoll = async ({ apiUrl, token, wait }: { apiUrl: string, token: string, wait?: number }): Promise<SearchSDK | { error: string }> => {
    let error: string = `Sorry, something happened and we couldnt do this`;
    let search: SearchSDK | null = null;

    try {
        if (wait) {
            await waitSeconds(wait);
        }
        const res = await fetch(
            `${apiUrl}/poll/${token}`
        );
        const json = await res.json();

        if (!json && json.statusCode === 500 && json.statusCode !== 200) {
            error = `Sorry, something happened and we couldnt do this search, maybe try a differnt search`;
        } else {
            search = skyscanner(json).search();
        }
    } catch (ex) {
        error = `Sorry, something happened and we couldnt do this`;
    }

    return search ? search : { error };
}