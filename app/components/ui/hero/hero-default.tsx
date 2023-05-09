import { useState } from 'react';
import { Link } from "@remix-run/react";
import { DateSimpleInput } from "~/components/date/index";
import { Location } from "~/components/location";
import { getDateFormated } from '~/helpers/date';
import { Spinner } from 'flowbite-react';
import { useNavigation } from "@remix-run/react";
import { setFromLocationLocalStorage, getFromPlaceLocalOrDefault, getSearchFromLocalStorage, addSearchToLocalStorage, removeAllSearchFromLocalStorage } from "~/helpers/local-storage";

export const Overlay = () => {

    return (<div className="opacity-80 bg-white dark:bg-gray-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>);
};
export const Gradient = () => {

    return (<div className="bg-gradient-to-t from-white dark:from-gray-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[70%] z-0"></div>);
};
export const Text = () => {

    return (<div> <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-800 md:text-5xl lg:text-6xl dark:text-white">
        Explore the World with Ease
    </h1>
        <p className="mb-8 text-lg font-normal text-gray-800 lg:text-xl sm:px-16 xl:px-48 dark:text-white">
            Find your perfect flight or holiday package with our unique traveler first features.
        </p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link
                to="/seo"
                className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
                Explore
                <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </Link>
        </div>
    </div>);
};

interface NewFeatureProps {
    text?: string;
}
export const NewFeature = ({ text = 'See our new feature' }: NewFeatureProps) => {

    return (<a
        href=''
        className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-white hover:bg-gray-200  rounded-full dark:bg-gray-800 dark:text-white  dark:hover:bg-gray-700"
        role="alert"
    >
        <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">
            New
        </span>{" "}
        <span className="text-sm font-medium">
            {text}
        </span>
        <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
            />
        </svg>
    </a>);

};
interface Query {
    from: string;
    fromIata: string;
    fromText: string;
    to: string;
    toIata: string;
    toText: string;
    depart: string;
    return: string;
    tripType: string;
}
interface FlightFormProps {
    apiUrl?: string;
    buttonLoading?: boolean;
    flightDefault?: Query;
}
export const FlightForm = ({
    apiUrl = '',
    buttonLoading = true,
    flightDefault,
}: FlightFormProps) => {
    const fromPlace = getFromPlaceLocalOrDefault();
    const defaultQuery: Query = flightDefault ? flightDefault : {
        from: fromPlace.entityId,
        fromIata: fromPlace.iata,
        fromText: fromPlace.name,
        to: '95673529', //Dublin
        toIata: 'DUB', //Dublin
        toText: 'Dublin', //Dublin
        depart: getDateFormated(1),
        return: getDateFormated(3),
        tripType: 'return',
    };
    const [previousSearches, setPreviousSearches] = useState(getSearchFromLocalStorage().reverse().slice(0, 5));
    const [query, setQuery] = useState<Query>(defaultQuery);
    const [loading, setLoading] = useState<boolean>(false);

    const handleQueryChange = (value: string, key: string) => {
        setQuery({ ...query, [key]: value });
    };
    const handleLocationChange = (value: string, key: string, iataCode: string) => {
        if (key === 'from') setFromLocationLocalStorage(iataCode);
        handleQueryChange(value, key);
        handleQueryChange(iataCode, `${key}Iata`);
    }
    const handleSearchClicked = () => {
        setLoading(true);
        addSearchToLocalStorage(query);
    }
    const navigation = useNavigation();

    return (<div className="bg-white rounded-2xl p-4 border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className=" text-left mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-2xl dark:text-white">
            Search
        </h1>

        <form
            action="#"
            className="grid gap-y-4 mt-8 w-full bg-white rounded lg:gap-x-4 lg:grid-cols-9 lg:mt-4 dark:bg-gray-800"
        >
            <div className="lg:col-span-2">
                <Location
                    name="From"
                    defaultValue={query.fromText}
                    apiUrl={apiUrl}
                    onSelect={(value, iataCode) => handleLocationChange(value, 'from', iataCode)}
                />
            </div>
            <div className="lg:col-span-2">
                <Location
                    name="From"
                    defaultValue={query.toText}
                    apiUrl={apiUrl}
                    onSelect={(value, iataCode) => handleLocationChange(value, 'to', iataCode)}
                />
            </div>
            <div date-rangepicker="" className="grid grid-cols-2 gap-x-4 lg:col-span-3">
                <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <DateSimpleInput
                        name="Depart"
                        value={query.depart}
                        onChange={(value: string) => handleQueryChange(value, 'depart')}
                    />
                </div>
                <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <DateSimpleInput
                        name="return"
                        value={query.return}
                        onChange={(value: string) => handleQueryChange(value, 'return')}
                    />
                </div>
            </div>
            <Link
                to={`/search-flight/${query.fromIata}/${query.toIata}/${query.depart}/${query.return}`}
                className="lg:col-span-2 justify-center md:w-auto text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex items-center"
                onClick={handleSearchClicked}
            >
                {navigation.state === 'loading' && loading ? (
                    <>
                        <Spinner aria-label="Spinner button example" />
                        <span className="pl-3">
                            Loading...
                        </span>
                    </>
                ) : (
                    <>
                        <svg
                            className="mr-2 -ml-1 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Search
                    </>
                )}
            </Link>
        </form>
        {previousSearches.length > 0 ? (
            <div className='py-2 text-left md:flex align-middle items-center'>
                <h3 className="mr-2 text-left my-4 text-sm tracking-tight leading-none text-gray-500 dark:text-white">
                    Previous Searches:
                </h3>
                {previousSearches.map(previousSearch => (
                    <Link
                        to={`/search-flight/${previousSearch.fromIata}/${previousSearch.toIata}/${previousSearch.depart}/${previousSearch.return}`}
                        className="mr-2 mb-2 md:mb-0 lg:col-span-2 justify-center md:w-auto text-slate-600 bg-slate-100 hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800 inline-flex items-center"
                        onClick={() => setLoading(true)}
                    >{previousSearch.fromIata} to {previousSearch.toIata}</Link>
                ))}
                <div
                    className='text-sm cursor-pointer hover:underline text-gray-400 hover:text-gray-600 dark:text-white'
                    onClick={() => { removeAllSearchFromLocalStorage(); setPreviousSearches([]) }}
                >Remove all</div>
            </div>
        ) : ''}
    </div>
    );
}

interface HeroDefaultProps {
    newFeature?: string;
    apiUrl?: string;
    showText?: boolean;
    buttonLoading?: boolean;
    flightDefault?: Query;
}

export const HeroDefault = ({
    newFeature,
    apiUrl,
    showText = true,
    buttonLoading = false,
    flightDefault,
}: HeroDefaultProps) => {
    return (<section className="bg-[url('/images/hero/airport.jpg')] relative bg-cover bg-bottom">
        <Overlay />
        <Gradient />
        <div className="relative z-10 py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            {newFeature ? <NewFeature text={newFeature} /> : ``}
            {showText ? <Text /> : ``}
            <FlightForm apiUrl={apiUrl} buttonLoading={buttonLoading} flightDefault={flightDefault} />
        </div>
    </section>
    );
}