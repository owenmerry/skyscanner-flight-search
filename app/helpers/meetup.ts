import type { PersonLocation } from "~/routes/meet-up";

export const getFullPrice = (locations: PersonLocation[], cityName?: string) => {
    let total = 0;
    locations.forEach((person) => {
      const quotePerson = person.quotes?.find(
        (item) => item.city?.name === cityName
      );
      if (!quotePerson || !quotePerson.price.raw) return "";
      total += quotePerson.price.raw;
    });
    return total;
  };