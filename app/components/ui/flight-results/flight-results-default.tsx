import { useState } from 'react';
import { Button } from 'flowbite-react';
import { FlightSDK, SearchSDK } from '~/helpers/sdk/flightSDK';
import { toHoursAndMinutes } from '~/helpers/sdk/dateTime';

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
                                <div className='grid grid-cols-4 items-center p-4'>
                                    <div className=''><img src={deepLink.agentImageUrl} /></div>
                                    <div className=''>{deepLink.agentName}</div>
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

interface FlightProps {
    flight: FlightSDK;
}
const Flight = ({ flight }: FlightProps) => {
    const [showDeals, setShowDeals] = useState(false);
    return (
        <div className='mb-2'>
            <div className='md:flex border-2 border-slate-100 py-4 px-4 rounded-lg'>
                <SegmentsColumn flight={flight} />
                <ButtonColumn flight={flight} onButtonSelect={() => setShowDeals(!showDeals)} showDeals={showDeals} />
            </div>
            {showDeals ? (
                <div>
                    <Deals flight={flight} />
                </div>
            ) : ''}
        </div>
    );
}

interface FlightResultsDefaultProps {
    flights: SearchSDK;
}

export const FlightResultsDefault = ({ flights }: FlightResultsDefaultProps) => {

    return (<div>
        {flights.cheapest.splice(0, 100).map((flight) => {
            return (
                <Flight flight={flight} />
            );
        })}
    </div>
    );

} 