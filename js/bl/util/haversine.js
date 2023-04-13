const toRadians = (value) => (value * Math.PI) / 180;

export default (origin, destination) => {
  const R = 6371; // km
  const x1 = destination.lat - origin.lat;
  const dLat = toRadians(x1);
  const x2 = destination.lng - origin.lng;
  const dLon = toRadians(x2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(origin.lat)) * Math.cos(toRadians(destination.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};
