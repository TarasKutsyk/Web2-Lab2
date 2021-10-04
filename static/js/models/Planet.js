class Planet extends BaseModel {
  constructor() {
    super('planets');

    this.fields = this.fields.concat('name', 'weight', 'storage');
  }
}
