export default async () => {
  const result = await fetch('https://restcountries.com/v3.1/subregion/America?fields=name,cca3,borders,latlng');
  const data = await result.json();
  return data;
};
