class SubmitController {
  static actions = {
    addRow: 0,
    editRow: 1,
  }

  constructor(submitButton, initialAction = SubmitController.actions.addRow) {
    this.submitButton = submitButton;
    this.action = initialAction;

    this.submitReady = true;

    this.payload = null;
  }

  SetEditState (payload) {
    this.action = SubmitController.actions.editRow;
    this.payload = payload;

    this.submitReady = false;
    this.submitButton.text('Edit');
  }

  SetCreateState() {
    this.action = SubmitController.actions.addRow;
    this.payload = null;

    this.submitReady = false;
    this.submitButton.text('Create');
  }
}

export default SubmitController;
