class SpaceStation extends BaseModel {
  constructor() {
    super('stations');

    this.fields = this.fields.concat('number', 'storage', 'need', 'planetLocation');
  }

  Create (data) {
    const hasTheSameNumber = this.IsThere(planet => planet.number === data.number);
    if (hasTheSameNumber) {
      throw new Error('Station with the same number already exists!');
    }

    if (data.planetLocation !== '-') {
      const planets = new Planet();

      if(!planets.IsThere(planet => planet.name === data.planetLocation)) {
        throw new Error('Planet with such name does not exist!');
      }
    }

    super.Create(data);
  }

  Update (id, data) {
    const hasTheSameNumber = this.IsThere(planet => planet.number === data.number && planet.id !== id);
    if (hasTheSameNumber) {
      throw new Error('Station with the same number already exists!');
    }

    if (data.planetLocation !== '-') {
      const planets = new Planet();

      if(!planets.IsThere(planet => planet.name === data.planetLocation)) {
        throw new Error('Planet with such name does not exist!');
      }
    }

    super.Update(id, data);
  }
}
