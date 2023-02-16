import {addDays} from 'date-fns';

export const getNextFriday =(date = new Date()) => {
    const dateCopy = new Date(date.getTime());

    const nextFriday = new Date(dateCopy.setDate(dateCopy.getDate() +((7 - dateCopy.getDay() + 5) % 7 || 7),),);

    return nextFriday;
}

export const getNextSunday =(date = new Date()) => {
    const dateCopy = new Date(date.getTime());

    const nextSunday = new Date(dateCopy.setDate(dateCopy.getDate() +((7 - dateCopy.getDay() + 7) % 7 || 7),),);

    return nextSunday;
}

export const getWeekendDates =(date : Date) => {
    const friday = getNextFriday(date);

    return {
        friday,
        sunday: getNextSunday(friday)
    };
};

export const convertDateToYYYMMDDFormat = (date: Date) => date.toISOString().split('T')[0];

export const addWeeksToDate = (date : Date,numberOfWeeks : number) => {
    date.setDate(date.getDate()+ numberOfWeeks * 7);
    return date;
}

export const getDateFormated = (add ?: number) : string => {
    const dateAdd = add || 0;
    const date = new Date()
    const updatedDate = addDays(date, dateAdd)
    
    return updatedDate.toISOString().split('T')[0];
}
