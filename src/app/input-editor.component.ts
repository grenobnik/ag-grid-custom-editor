import {Component} from '@angular/core';
import {ICellEditorParams} from 'ag-grid-community';
import {AgEditorComponent} from 'ag-grid-angular';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-ag-grid-reactive-input',
  templateUrl: './input-editor.component.html',
})
export class InputEditorComponent implements AgEditorComponent {

  formGroup: FormGroup;
  field: string;

  agInit(params: ICellEditorParams): void {
    this.field = params.colDef.field;
    this.formGroup = params.context.parent.formGroup;
  }

  isPopup(): boolean {
    return false;
  }

  getValue(): string | number {
    if (this.formGroup.get(this.field) !== null && this.formGroup.get(this.field) !== undefined) {
      return this.formGroup.get(this.field).value;
    }
    return null;
  }
}
