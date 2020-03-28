import {Component} from '@angular/core';
import {AgRendererComponent} from 'ag-grid-angular';
import {ICellRendererParams, RowNode} from 'ag-grid-community';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-actions-menu',
  templateUrl: './actions-menu.component.html',
})
export class ActionsMenuComponent implements AgRendererComponent {

  params: any;
  rowNode: RowNode;
  isModeEdit = false;
  isActionsMenuDisabled = false;
  formGroup: FormGroup;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.rowNode = params.node;
    this.formGroup = params.context.parent.formGroup;
  }

  refresh(params: any): boolean {
    return false;
  }

  startFullRowEdit() {
    this.setDisabledState(true);
    this.isModeEdit = true;
    const rowIndex = this.params.node.rowIndex;
    this.params.context.parent.startFullRowEdit(rowIndex);
  }

  submit() {
    console.log('in ActionsMenuComponent.submit()');
  }

  cancel() {
    console.log('in ActionsMenuComponent.cancel()');
    this.isModeEdit = false;
    this.setDisabledState(false);
    this.params.context.parent.cancelEditing();
  }

  setDisabledState(state: boolean) {
    const renderers = this.params.api.getCellRendererInstances();
    if (!!renderers && renderers.length > 0) {
      renderers.forEach(renderer => {
        if (renderer.getFrameworkComponentInstance() instanceof ActionsMenuComponent) {
          const actionsMenuComponentRenderer = renderer.getFrameworkComponentInstance() as ActionsMenuComponent;
          actionsMenuComponentRenderer.isActionsMenuDisabled = state;
        }
      });
    }
  }
}
