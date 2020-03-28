import {Component} from '@angular/core';
import {AppService, Car, CustomValidationResult} from './app.service';
import {
  CellMouseDownEvent,
  ColumnApi,
  GridApi,
  GridOptions,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  RowNode
} from 'ag-grid-community';
import {ActionsMenuComponent} from './actions-menu.component';
import {FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {InputEditorComponent} from './input-editor.component';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, delay, filter, map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  private isEditorOpen = false;
  private rowValueBeforeEditing: Car;
  private rowNodeModif: RowNode;
  formGroup: FormGroup = new FormGroup({});
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  gridOptions: GridOptions = {
    animateRows: true,
    editType: 'fullRow',
    suppressClickEdit: true,
    frameworkComponents: {
      actions: ActionsMenuComponent,
      inputEditor: InputEditorComponent,
    },
    defaultColDef: {
      flex: 1,
      editable: true,
    },
    columnDefs: [
      {
        headerName: 'Make',
        field: 'make',
        cellEditor: 'inputEditor',
      },
      {
        headerName: 'Model',
        field: 'model',
        cellEditor: 'inputEditor',
      },
      {
        headerName: 'Price',
        field: 'price',
        type: 'numericColumn',
        cellEditor: 'inputEditor',
      },
      {
        headerName: 'Actions',
        pinned: 'right',
        cellRenderer: 'actions',
        editable: false,
        width: 250,
        colId: 'actions',
        sortable: false,
        filter: false,
      }
    ],
    context: {
      parent: this,
    },
    onCellMouseDown: (event: CellMouseDownEvent) => {
      console.log('onCellMouseDown');
    },
  };
  private asyncValidationErrors: { [key: string]: ValidationErrors } = {};

  constructor(private appService: AppService) {
    appService.get().subscribe({
      next: data => {
        this.gridOptions.rowData = data;
      },
    });
    this.formGroup.valueChanges.pipe(
      this.validateForm,
    ).subscribe();
  }

  validateForm: OperatorFunction<Car, string[]> | null =
    (source: Observable<Car>) => source.pipe(
      filter(() => this.isEditorOpen),
      tap(() => this.formGroup.markAsPending()),
      debounceTime(500),
      delay(3000),
      switchMap(() => {
        this.asyncValidationErrors = {};
        return this.appService.validate(this.formGroup.getRawValue()).pipe(
          map((response: CustomValidationResult) => {
            if (!!response.body) {
              const errorFields = Object.keys(response.body);
              if (errorFields.includes('price')) {
                this.formGroup.get('price').setErrors(response.body.price);
                console.log(this.formGroup);
              }
            } else {
              this.clearAllErrors();
              return null;
            }
          }),
        );
      }),
    );

  clearAllErrors(): void {
    Object.keys(this.formGroup.controls).forEach(field => this.formGroup.get(field).setErrors(null));
    this.formGroup.setErrors(null);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  startFullRowEdit(rowIndex: number) {
    this.isEditorOpen = true;
    this.rowValueBeforeEditing = {...this.gridApi.getDisplayedRowAtIndex(rowIndex).data};
    this.createFormControls(this.rowValueBeforeEditing);
    this.gridApi.setFocusedCell(rowIndex, 'make');
    this.gridApi.startEditingCell({rowIndex, colKey: 'make'});
  }

  onRowEditingStarted($event: RowEditingStartedEvent) {
    this.rowNodeModif = $event.node;
  }

  cancelEditing() {
    // console.log('in AppComponent.cancelEditing()');
    this.gridApi.stopEditing();
    this.rowNodeModif.setData(this.rowValueBeforeEditing);
  }

  onRowEditingStopped($event: RowEditingStoppedEvent) {
    console.log('onRowEditingStopped');
    this.resetFormGroup();
    this.isEditorOpen = false;
  }

  private resetFormGroup(): void {
    Object.keys(this.formGroup.controls).forEach(control => this.formGroup.removeControl(control));
    this.formGroup.reset();
  }

  private createFormControls(car: Car) {
    // console.log('in createFormControls');
    this.formGroup.addControl('make', new FormControl(car.make));
    this.formGroup.addControl('model', new FormControl(car.model));
    this.formGroup.addControl('price', new FormControl(car.price));
  }
}
