import { Component, OnInit } from '@angular/core';
import { FileOptions } from 'share-libs/modules/upload-file/share-file-upload/share-file-upload.component';

@Component({
  selector: 'app-ex-share-file',
  templateUrl: './ex-share-file.component.html',
  styleUrls: ['./ex-share-file.component.less']
})
export class ExShareFileComponent implements OnInit {
  inOptions: FileOptions
  constructor() { }

  ngOnInit() {
  }

}
