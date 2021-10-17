'use strict'
import SubmitController from './utility/SubmitController.js';

const cargoModel = new Cargo();
const submitController = new SubmitController($('.control-button'));
let cargoTable = null;

function initAddForm () {
  const form = window.document.querySelector('#cargo-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!submitController.submitReady) {
      return;
    }

    const formData = new FormData(e.target);
    const cargoData = {};
    formData.forEach((value, key) => {
      if (cargoModel.fields.includes(key)) {
        cargoData[key] = value
      }
    });

    try {
      if (submitController.action === SubmitController.actions.addRow) {
        cargoModel.Create(cargoData);
      } else if (submitController.action === SubmitController.actions.editRow) {
        const {rowIndex, rowId} = submitController.payload;

        cargoModel.Update(rowId, cargoData);

        cargoTable.row(rowIndex).data({id: rowId, ...cargoData}).draw();
      }
    } catch (e) {
      console.error(e.message);
    }
    finally {
      submitController.SetCreateState();
    }

    e.target.reset();
  })
}

function initList () {
  cargoTable = window.jQuery('#cargoes-list').DataTable({
    data: cargoModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Code', data: 'code' },
      { title: 'Name', data: 'name' },
      { title: 'Weight', data: 'weight' },
      { title: 'To planet:', data: 'planetDestination' },
      { title: 'To station:', data: 'stationDestination' },
      { title: 'Controls',
        render: () => `<button action="delete" class="btn btn-danger">Delete</button>
                       <button action="edit" class="btn btn-success">Edit</button>`
      },
    ]
  });

  $('.control-button').on('click', function () {
    submitController.submitReady = true;
  });

  $('#cargoes-list').on('click', 'tbody tr button[action="delete"]', function(event){
    const rowToDelete = $(event.target).closest('tr');
    const rowId = +rowToDelete.children(":first").text();

    cargoTable.row(rowToDelete).remove().draw();
    cargoModel.Delete(rowId);
  });

  $('#cargoes-list').on('click', 'tbody tr button[action="edit"]', function(event){
    const rowNode = $(event.target).closest('tr');
    const rowId = +rowNode.children(":first").text();

    const rowToEdit = cargoTable.row(rowNode);

    const elementToEdit = cargoModel.FindById(rowId);
    document.getElementById("name").value = elementToEdit.name;
    document.getElementById("weight").value = elementToEdit.weight;
    document.getElementById("code").value = elementToEdit.code;
    document.getElementById("planetDestination").value = elementToEdit.planetDestination;
    document.getElementById("stationDestination").value = elementToEdit.stationDestination;

    submitController.SetEditState({
      rowIndex: rowToEdit.index(),
      rowId,
    });
  });
}

function initListEvents () {
  document.addEventListener('cargoesListDataChanged', function (e) {
    const dataTable = window.jQuery('#cargoes-list').DataTable();

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
