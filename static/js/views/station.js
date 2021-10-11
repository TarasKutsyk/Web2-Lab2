'use strict'
import SubmitController from './utility/SubmitController.js';

const stationModel = new SpaceStation();
const submitController = new SubmitController($('.control-button'));
let stationTable = null;

function initAddForm () {
  const form = window.document.querySelector('#station-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!submitController.submitReady) {
      return;
    }

    const formData = new FormData(e.target);
    const stationData = {};
    formData.forEach((value, key) => {
      if (stationModel.fields.includes(key)) {
        stationData[key] = value
      }
    });

    try {
      if (submitController.action === SubmitController.actions.addRow) {
        stationModel.Create(stationData);
      } else if (submitController.action === SubmitController.actions.editRow) {
        const {rowIndex, rowId} = submitController.payload;

        stationModel.Update(rowId, stationData);

        stationTable.row(rowIndex).data({id: rowId, ...stationData}).draw();
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
  stationTable = window.jQuery('#station-list').DataTable({
    data: stationModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Number', data: 'number' },
      { title: 'Storage', data: 'storage' },
      { title: 'Is Available', data: 'isAvailable' },
      { title: 'Planet', data: 'planetLocation' },
      { title: 'Controls',
        render: () => `<button action="delete" class="btn btn-danger">Delete</button>
                       <button action="edit" class="btn btn-success">Edit</button>`
      },
    ]
  });

  $('.control-button').on('click', function () {
    submitController.submitReady = true;
  });

  $('#station-list').on('click', 'tbody tr button[action="delete"]', function(event){
    const rowToDelete = $(event.target).closest('tr');
    const rowId = +rowToDelete.children(":first").text();

    stationTable.row(rowToDelete).remove().draw();
    stationModel.Delete(rowId);
  });

  $('#station-list').on('click', 'tbody tr button[action="edit"]', function(event){
    const rowNode = $(event.target).closest('tr');
    const rowId = +rowNode.children(":first").text();

    const rowToEdit = stationTable.row(rowNode);

    const elementToEdit = stationModel.FindById(rowId);
    document.getElementById("number").value = elementToEdit.number;
    document.getElementById("storage").value = elementToEdit.storage;
    document.getElementById("isAvailable").value = elementToEdit.isAvailable;
    document.getElementById("planetLocation").value = elementToEdit.planetLocation;

    submitController.SetEditState({
      rowIndex: rowToEdit.index(),
      rowId,
    });
  });
}

function initListEvents () {
  document.addEventListener('stationsListDataChanged', function (e) {
    const dataTable = window.jQuery('#station-list').DataTable();

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
