class Planet extends BaseModel {
  constructor() {
    super('planets');

    this.fields = this.fields.concat('name', 'weight', 'storage');
  }

  Create (data) {
    const hasTheSameName = this.IsThere(planet => planet.name === data.name);
    if (hasTheSameName) {
      throw new Error('Planet with the same name already exists!');
    }

    super.Create(data);
  }

  Update (id, data) {
    const hasTheSameName = this.IsThere(planet => planet.name === data.name && planet.id !== id);
    if (hasTheSameName) {
      throw new Error('Planet with the same name already exists!');
    }

    super.Update(id, data);
  }
}
