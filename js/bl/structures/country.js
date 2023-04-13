export default class Country {
  constructor(data) {
    this.code = data.cca3;
    this.name = data.name.common;
    this.coordinates = { lat: data.latlng[0], lng: data.latlng[1] };
    this.borders = data.borders || [];
  }
}
