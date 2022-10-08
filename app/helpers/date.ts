export const getNextFriday = (date = new Date()) => {
    const dateCopy = new Date(date.getTime());
  
    const nextFriday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7),
      ),
    );
  
    return nextFriday;
}

export const getNextSunday = (date = new Date()) => {
    const dateCopy = new Date(date.getTime());
  
    const nextSunday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 7) % 7 || 7),
      ),
    );
  
    return nextSunday;
}

export const getWeekendDates = (date : Date) => {
    const friday = getNextFriday(date);
    
    return {
        friday,
        sunday: getNextSunday(friday)
    };
};

export const convertDateToYYYMMDDFormat = (date: Date) => 
    date.toISOString().split('T')[0];

