class Cargo {
  constructor(code, name, weight) {
    this.code = code;
    this.name = name;
    this.weight = weight;
  }

  toString() {
    return `Cargo #${this.code}: \'${this.name}\', ${this.weight} kg`;
  }
}

class DeliveredCargo extends Cargo {
  constructor(code, name, weight, planetOrStation) {
    super(code, name, weight);
    this.deliveredTo = planetOrStation;
  }
}

module.exports = {Cargo, DeliveredCargo};
