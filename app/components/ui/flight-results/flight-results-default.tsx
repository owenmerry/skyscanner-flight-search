import { useState } from 'react';
import { Button } from 'flowbite-react';
import { FlightSDK, SearchSDK } from '~/helpers/sdk/flightSDK';
import { toHoursAndMinutes } from '~/helpers/sdk/dateTime';
import type { SearchFilters } from '~/helpers/sdk/filters';
import { addSearchResultFilters } from '~/helpers/sdk/filters';

interface SegmentsProps {
    flight: FlightSDK;
}
const SegmentsColumn = ({ flight }: SegmentsProps) => {
    return (
        <div className='col-span-2 flex-1'>
            {flight.legs.map((leg) => {
                const duration = toHoursAndMinutes(leg.duration);
                const durationShow = `${duration.hours > 0 && `${duration.hours}h `}${duration.minutes}m`
                return (
                    <div className='grid grid-cols-3 pb-4 last:pb-0'>
                        <div className="">
                            {leg.carriers.map(carrier => (
                                <>
                                    <img className='inline-block w-20 p-1' src={carrier.imageUrl} />
                                    {/* <div className="hidden md:block self-center text-sm text-slate-400">{carrier.name}</div> */}
                                </>
                            ))}
                        </div>

                        <div className="col-span-2 grid grid-cols-3 flex-1">
                            <div className="text-center">
                                <div className="text-xl font-bold">{leg.departureTime}</div>
                                <div className="text-slate-400">{leg.fromIata}</div>
                            </div>

                            <div className="text-center">
                                <div className="text-slate-400 text-sm">{durationShow}</div>
                                <hr className='my-2' />
                                <div className="text-slate-400 text-sm">{leg.direct ? 'Direct' : leg.stops === 1 ? '1 Stop' : `${leg.stops} Stops`}</div>
                            </div>

                            <div className="text-center">
                                <div className="text-xl font-bold">{leg.arrivalTime}</div>
                                <div className="text-slate-400">{leg.toIata}</div>
                            </div>
                        </div>
                    </div >
                )
            })}
        </div>
    );
}

interface DealsProps {
    flight: FlightSDK;
}
const Deals = ({ flight }: DealsProps) => {
    return (
        <div className='border-slate-100 border-x-2'>
            {
                flight.prices.map((price) => (
                    <div className='border-slate-100 border-b-2 top:border-b-0 last:border-b-0'>
                        {
                            price.deepLinks.map((deepLink) => (
                                <div className='grid grid-cols-3 md:grid-cols-4 items-center p-4'>
                                    <div className=''><img src={deepLink.agentImageUrl} /></div>
                                    <div className='hidden md:block'>{deepLink.agentName}</div>
                                    <div className=''>{price.price}</div>
                                    <div className='self-end'><Button href={deepLink.link} target='_blank'>Book</Button></div>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>);
}

interface ButtonProps {
    flight: FlightSDK;
    showDeals: boolean;
    onButtonSelect: () => void
}
const ButtonColumn = ({ flight, onButtonSelect, showDeals }: ButtonProps) => {
    return (
        <div className='self-center flex justify-self-end'>
            <div className='self-center'>
                <span className='text-sm text-slate-400'>from</span> <span className='text-xl font-bold'>{flight.price.split('.')[0]}</span>
            </div>
            <Button outline={showDeals} className='ml-2' onClick={onButtonSelect}>{showDeals ? 'Hide' : 'Select'}</Button>
        </div>
    );
}

interface LabelsProps {
    flight: FlightSDK;
    labels: {
        text: string,
        labelBg: string,
        show: boolean,
    }[]
}
const Labels = ({ labels, flight }: LabelsProps) => {
    return (
        <>
            {labels.map(label => (
                <>
                    {
                        label.show ? (
                            <span className={` bg-${label.labelBg}-100 text-${label.labelBg}-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-${label.labelBg}-200 dark:text-${label.labelBg}-900`}>
                                {label.text}
                            </span>
                        ) : ''
                    }
                </>
            ))}
        </>
    )
}
interface FlightProps {
    flight: FlightSDK;
}
const Flight = ({ flight }: FlightProps) => {
    const [showDeals, setShowDeals] = useState(false);
    const labelBg = 'purple';
    const labels = [
        {
            text: 'Direct',
            labelBg: 'purple',
            show: flight.isDirectFlights,
        },
        {
            text: 'Airline Option',
            labelBg: 'green',
            show: flight.prices.map(price => price.deepLinks.map(link => link.type === 'AGENT_TYPE_AIRLINE').length > 0).length > 0,
        },
    ];

    return (
        <div className='mb-2'>
            <div className='border-2 border-slate-100 py-4 px-4 rounded-lg'>
                <Labels flight={flight} labels={labels} />
                <div className='md:flex'>
                    <SegmentsColumn flight={flight} />
                    <ButtonColumn flight={flight} onButtonSelect={() => setShowDeals(!showDeals)} showDeals={showDeals} />
                </div>
                {showDeals ? (
                    <div>
                        <Deals flight={flight} />
                    </div>
                ) : ''}
            </div>
        </div>
    );
}

interface PagingProps {
    total?: number;
    shown?: number;
    onShowMore?: (number: number) => void;
};

const Paging = ({ shown = 100, total = 1000, onShowMore = (number: number) => { } }: PagingProps) => {
    return (
        <>
            {total > shown ? (
                <div className='my-4 text-center'>
                    <button className='text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:hover:bg-blue-600 focus:!ring-2 group h-min items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg ml-2' onClick={() => onShowMore(shown + 100)}>
                        <span className="flex items-center rounded-md text-sm px-4 py-2">Show more results (Showing<b className='px-1'>1-{shown}</b>of<b className='px-1'>{total}</b>)</span>
                    </button>
                </div>
            ) : ''}
        </>
    );
}


interface FlightResultsDefaultProps {
    flights: SearchSDK;
    filters?: SearchFilters;
}

export const FlightResultsDefault = ({ flights, filters = {} }: FlightResultsDefaultProps) => {
    const [results, setResults] = useState(filters.numberOfResultsToShow || 10);
    console.log(filters);
    const filteredResults = () => (addSearchResultFilters(flights.cheapest, {
        ...filters,
        numberOfResultsToShow: results,
    }));


    return (<div>
        <div className='border-2 border-slate-100 py-4 px-4 rounded-lg mb-2'>
            Showing<b className='px-1'>1-{results}</b>of<b className='px-1'>{filteredResults().total}</b>
        </div>
        {filteredResults().results.map((flight) => {
            return (
                <Flight flight={flight} />
            );
        })}
        <Paging
            total={filteredResults().total}
            shown={results}
            onShowMore={(amount) => setResults(amount)} />
    </div>
    );

} 