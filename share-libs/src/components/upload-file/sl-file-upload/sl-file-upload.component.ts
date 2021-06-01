import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
@Component({
    template: `
    <div class="sl-file-upload">
    <div class='upload-button' (click)="uploadFile()">{{title}}</div>
    <input type="file" ng2FileSelect [uploader]="uploader" (change)="selectedFileOnChanged()" id="fileUp" style="display: none"/>
    </div>
    `,
    styleUrls: ['./sl-file-upload.component.less'],
    selector: 'sl-file-upload'
})
export class SlFileUpload {
    constructor() { }
    token: string = "";
    uploader
    @Input() title: string = "上传文件";
    @Output() successPath: EventEmitter<any> = new EventEmitter()
    selectedFileOnChanged() {
        this.uploader.uploadAll();
    };
    ngOnInit(): void {
        this.uploaderSet();
    }
    uploaderSet() {
        this.uploader = new FileUploader({
            url: '/api/Content/upload',
            method: "POST",
            headers: [{ name: "X-XSRF-TOKEN", value: this.token }],
            itemAlias: "file",
            allowedFileType: ['image']
        });
        let uploader = this.uploader;
        uploader.onWhenAddingFileFailed = (item, filter, options) => {
            console.log('onWhenAddingFileFailed')
        };
        uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            console.log('goods.httpError')
        };
        uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            var res = JSON.parse(response);
            if (res.rlt === 0) {
                let datas = res.datas;
                this.successPath.emit(datas)
            }
        };
        uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
        };
    }
    uploadFile() {
        $("#fileUp").click();
    }
}