'use strict'
import SubmitController from './utility/SubmitController.js';

const planetModel = new Planet();
const submitController = new SubmitController($('.control-button'));
let planetTable = null;

function initAddForm () {
  const form = window.document.querySelector('#planet-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!submitController.submitReady) {
      return;
    }

    const formData = new FormData(e.target);
    const planetData = {};
    formData.forEach((value, key) => {
      if (planetModel.fields.includes(key)) {
        planetData[key] = value
      }
    });

    if (submitController.action === SubmitController.actions.addRow) {
      planetModel.Create(planetData);
    } else if (submitController.action === SubmitController.actions.editRow) {
      const {rowIndex, rowId} = submitController.payload;

      planetTable.row(rowIndex).data({id: rowId, ...planetData}).draw();
      planetModel.Update(rowId, planetData);

      submitController.SetCreateState();
    }

    e.target.reset();
  })
}

function initList () {
  planetTable = window.jQuery('#planet-list').DataTable({
    data: planetModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Name', data: 'name' },
      { title: 'Weight', data: 'weight' },
      { title: 'Storage', data: 'storage' },
      { title: 'Controls',
        render: () => `<button action="delete" class="btn btn-danger">Delete</button>
                       <button action="edit" class="btn btn-success">Edit</button>`
      },
    ]
  });

  $('.control-button').on('click', function () {
    submitController.submitReady = true;
  });

  $('#planet-list').on('click', 'tbody tr button[action="delete"]', function(event){
    const rowToDelete = $(event.target).closest('tr');
    const rowId = +rowToDelete.children(":first").text();

    planetTable.row(rowToDelete).remove().draw();
    planetModel.Delete(rowId);
  });

  $('#planet-list').on('click', 'tbody tr button[action="edit"]', function(event){
    const rowNode = $(event.target).closest('tr');
    const rowId = +rowNode.children(":first").text();

    const rowToEdit = planetTable.row(rowNode);

    const elementToEdit = planetModel.FindById(rowId);
    document.getElementById("name").value = elementToEdit.name;
    document.getElementById("weight").value = elementToEdit.weight;
    document.getElementById("storage").value = elementToEdit.storage;

    submitController.SetEditState({
      rowIndex: rowToEdit.index(),
      rowId,
    });
  });
}

function initListEvents () {
  document.addEventListener('planetsListDataChanged', function (e) {
    const dataTable = window.jQuery('#planet-list').DataTable();

    dataTable.clear();
    dataTable.rows.add(e.detail);
    dataTable.draw();
  }, false)
}

window.addEventListener('DOMContentLoaded', e => {
  initAddForm();
  initList();
  initListEvents();
});
