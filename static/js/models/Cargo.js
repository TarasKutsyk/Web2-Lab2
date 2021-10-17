class Cargo extends BaseModel{
  constructor() {
    super('cargoes');

    this.fields = this.fields.concat('code', 'name', 'weight', 'planetDestination', 'stationDestination');
  }

  ValidatePlanet(planetName) {
    const planets = new Planet();

    const planet = planets.FindByPredicate(planet => planet.name === planetName);
    if (!planet) {
      throw new Error('Planet with such name does not exist!');
    }

    const cargoesWithTheSamePlanet = this.CountByPredicate(cargo => cargo.planetDestination === planetName);
    if (cargoesWithTheSamePlanet >= planet.storage) {
      throw new Error('This planet cannot receive any more cargoes');
    }
  }

  ValidateStation(stationNumber) {
    const stations = new SpaceStation();

    const station = stations.FindByPredicate(station => station.number === stationNumber);
    if (!station) {
      throw new Error('Station with such number does not exist!');
    }

    const cargoesWithTheSameStation = this.CountByPredicate(cargo => cargo.stationDestination === stationNumber);
    if (cargoesWithTheSameStation >= station.storage) {
      throw new Error('This station cannot receive any more cargoes');
    }
  }

  Create(row) {
    const hasTheSameCode = this.IsThere(cargo => cargo.code === row.code);
    if (hasTheSameCode) {
      throw new Error('Cargo with the same code already exists!');
    }
    if (this.isNotEmpty(row.planetDestination)) {
      if (this.isNotEmpty(row.stationDestination)) {
        throw new Error('You must choose either a planet or a station for cargo delivery.')
      }

      this.ValidatePlanet(row.planetDestination);
    } else if (this.isNotEmpty(row.stationDestination)) {
      this.ValidateStation(row.stationDestination);
    }

    super.Create(row);
  }

  isNotEmpty(strField) {
    return strField !== '-';
  }

  Update(id, data) {
    const hasTheSameCode = this.IsThere(cargo => cargo.code === data.code && cargo.id !== id);
    if (hasTheSameCode) {
      throw new Error('Cargo with the same code already exists!');
    }

    if (this.isNotEmpty(data.planetDestination)) {
      if (this.isNotEmpty(data.stationDestination)) {
        throw new Error('You must choose either a planet or a station for cargo delivery.')
      }

      this.ValidatePlanet(data.planetDestination);
    } else if (this.isNotEmpty(data.stationDestination)) {
      this.ValidateStation(data.stationDestination);
    }

    super.Update(id, data);
  }
}
