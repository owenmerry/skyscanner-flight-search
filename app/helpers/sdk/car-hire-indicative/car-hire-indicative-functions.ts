export const getVehicleTypeDisplay = (vehicleType: string) => {
  const typeMapper: { [key: string]: string } = {
    VEHICLE_TYPE_SMALL: "Small",
    VEHICLE_TYPE_MEDIUM: "Medium",
    VEHICLE_TYPE_SUV: "SUV",
    VEHICLE_TYPE_VAN: "Van",
    VEHICLE_TYPE_LUXURY: "LUXURY",
    VEHICLE_TYPE_LARGE: "LARGE",
  };

  return typeMapper[vehicleType] || vehicleType;
};
