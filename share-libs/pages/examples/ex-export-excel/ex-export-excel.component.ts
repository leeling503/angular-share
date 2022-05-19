import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ex-export-excel',
  template: `
    <app-json-to-sheet></app-json-to-sheet>
    <hr>
    <app-table-to-sheet></app-table-to-sheet>
  `,
})
export class ExExportExcelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
