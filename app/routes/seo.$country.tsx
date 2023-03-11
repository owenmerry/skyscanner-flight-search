import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import globalStyles from '~/styles/global.css';
import flightStyles from '~/styles/flight.css';
import geoData from "~/data/geo.json";

export const links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: globalStyles },
        { rel: 'stylesheet', href: flightStyles },
    ];
}

interface Place {
    entityId: string;
    parentId: string;
    name: string;
    type: string;
    iata: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export const loader: LoaderFunction = async ({ request, context, params }) => {
    const apiUrl = process.env.SKYSCANNER_APP_API_URL;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    return json({
        params,
        apiUrl,
        googleApiKey,
        places: geoData.places,
    });
};

export default function SEOAnytime() {
    const { apiUrl, googleApiKey, params, places } = useLoaderData();
    const placeList: Place[] = Object.keys(places).map((placeKey) => (places[placeKey]));

    return (
        <div>
            <div className='banner'>
                <Link className='link-light' to="/seo">Back</Link>
            </div>
            <div className='wrapper'>
                <div className='panel'>
                    <h2>Select a City</h2>
                </div>
                <div className='panels'>
                    {placeList.sort((a, b) => a.name.localeCompare(b.name)).map((place) => {
                        if (!(place.type === 'PLACE_TYPE_CITY' && place.parentId === params.country)) return;

                        return (
                            <div className='panel'>
                                <h3>{place.name} ({place.iata})</h3>
                                <div>
                                    <i>{place.type}, ID: {place.entityId}, Parent: {place.parentId}</i>
                                </div>
                                <div>
                                    <Link className='button' to={`/explore/${place.entityId}/anywhere/${new Date().getMonth() + 1}`}>View</Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
