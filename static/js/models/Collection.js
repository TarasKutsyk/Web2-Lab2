module.exports = class Collection {
  #collection = [];
  constructor(collection) {
    this.#collection = collection
  }

  addElement (element) {
    this.#collection.push(element);
  }

  findElement (predicate) {
    return this.#collection.find(predicate);
  }

  deleteElement (predicate) {
    const indexToDelete = this.#collection.findIndex(predicate);
    if (indexToDelete !== -1) {
      this.#collection.splice(indexToDelete, 1);
    }
  }

  editElement(predicate, newProperties) {
    const indexToEdit = this.#collection.findIndex(predicate);
    if (indexToEdit !== -1) {
      this.#collection[indexToEdit] = Object.assign(this.#collection[indexToEdit], newProperties)
    }
  }

  findByProperty (propertyName, targetValue) {
    return this.findElement(el => el[propertyName] === targetValue);
  }

  editByProperty (propertyName, propertyValue, newProperties) {
    return this.editElement(el => el[propertyName] === propertyValue, newProperties);
  }

  deleteByProperty (propertyName, targetValue) {
    this.deleteElement(el => el[propertyName] === targetValue);
  }

  toString() {
    return this.#collection.map(element => element.toString());
  }

  print() {
    console.log(this.toString())
  }
}
