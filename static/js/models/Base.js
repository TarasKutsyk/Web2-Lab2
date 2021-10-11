class BaseModel {// eslint-disable-line no-unused-vars
  constructor (collectionName) {
    this.collectionName = collectionName;
    this.fields = ['id'];

    const storedCounter = +localStorage.getItem(`${this.collectionName}_counter`);
    this.counter = (storedCounter >= 0) ? storedCounter : 0;
  }
  /**
   * @returns {Number}
   */
  getNextId () {
    ++this.counter;

    localStorage.setItem(`${this.collectionName}_counter`, this.counter.toString());

    return this.counter;
  }
  /**
   * @returns {Object}
   */
  GetEmpty () {
    const entry = {}

    this.fields.forEach(element => {
      entry[element] = null
    })

    return entry
  }
  /**
   * @returns {Array}
   */
  Select () {
    const stored = localStorage.getItem(this.collectionName);
    const collection = stored ? JSON.parse(stored) : [];

    return collection;
  }
  Commit (collection) {
    localStorage.setItem(this.collectionName, JSON.stringify(collection));
  }
  /**
   * @param {Number} id
   * @returns {BaseModel|undefined}
   */
  FindById (id) {
    return this.Select().find(item => item.id === id)
  }
  /**
   * @param {Number} id
   * @returns {Number}
   */
  FindIndexById (id) {
    return this.Select().findIndex(item => item.id === id)
  }

  /**
   *
   * (element => boolean) predicate
   * @returns {boolean}
   */
  IsThere(predicate) {
    return this.Select().some(predicate);
  }

  Create (row) {
    const collection = this.Select();
    const entry = this.GetEmpty();

    entry.id = this.getNextId();
    for (const key in row) {
      if (entry.hasOwnProperty(key) &&
          entry.key !== 'id') {
        entry[key] = row[key];
      }
    }

    collection.push(entry);
    this.Commit(collection);

    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, { detail: collection });
    document.dispatchEvent(event);
  }

  Update (id, data) {
    let element = this.FindById(id);
    const elementIndex = this.FindIndexById(id);

    if (!element) {
      console.error(`Element with id = ${id} to be updated does not exist`);
      return;
    }

    element = Object.assign(element, data);

    const collection = this.Select();
    collection[elementIndex] = element;
    this.Commit(collection);
  }

  Delete (id) {
    const collection = this.Select();
    const elementIndex = this.FindIndexById(id);

    collection.splice(elementIndex, 1);
    this.Commit(collection);
  }
}
