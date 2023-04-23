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
                        <div className="flex">
                            {leg.carriers.map(carrier => (
                                <>
                                    <img className='w-20 p-1' src={carrier.imageUrl} />
                                    <div className="self-center text-sm text-slate-400">{carrier.name}</div>
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
                                <div className="text-slate-400 text-sm">Direct</div>
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

interface ButtonProps {
    flight: FlightSDK;
}
const ButtonColumn = ({ flight }: ButtonProps) => {
    return (
        <div className='self-center flex justify-self-end'>
            <div className='self-center'>
                <span className='text-sm text-slate-400'>from</span> <span className='text-xl font-bold'>{flight.price.split('.')[0]}</span>
            </div>
            <Button className='ml-2'>Select</Button>
        </div>
    );
}

interface FlightProps {
    flight: FlightSDK;
}
const Flight = ({ flight }: FlightProps) => {
    return (
        <div className='flex border-2 border-slate-100 py-4 px-4 mb-2 rounded-lg'>

            <SegmentsColumn flight={flight} />
            <ButtonColumn flight={flight} />

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