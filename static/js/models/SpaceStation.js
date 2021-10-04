class SpaceStation {
  constructor(id, capacity, isAvailable) {
    this.id = id;
    this.capacity = capacity;
    this.isAvailable = isAvailable;
  }

  toString() {
    return `Station #${this.id}, with a capacity of ${this.capacity} cargo items, currently
     ${this.isAvailable ? 'available' : 'not available'}`;
  }
}

class OrbitStation extends SpaceStation {
  constructor(id, capacity, isAvailable, planet) {
    super(id, capacity, isAvailable);
    this.planet = planet;
  }

  toString() {
    return super.toString() + `\nIt is located at the orbit of planet ${this.planet.name}`;
  }
}

module.exports = {
  SpaceStation, OrbitStation
}
