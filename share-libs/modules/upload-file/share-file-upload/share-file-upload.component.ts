import { Component, EventEmitter, Output, Input, SimpleChanges, ElementRef } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileLikeObject, FileUploaderOptions } from 'ng2-file-upload';
import * as $ from "jquery"
import { UtilChanges } from 'share-libs/utils';
@Component({
    template: `
    <div class="share-file-upload">
    <div class='upload-button' (click)="uploadFile()">{{inTitle}}</div>
    <input type="file" ng2FileSelect [uploader]="uploader"  (change)="selectedFileOnChanged()" id="fileUp" style="display: none"/>
    <input type="file" ng2FileSelect [uploader]="uploader"  (change)="selectedFileOnChanged()" id="multipleFileUp" multiple style="display: none" />
    </div>
    `,
    styleUrls: ['./share-file-upload.component.less'],
    selector: 'share-file-upload'
})
export class ShareFileUploadComponent {
    constructor(private el: ElementRef) {

    }
    uploadEl: HTMLElement;
    token: string = "";
    uploader: FileUploader;

    @Input() inTitle: string = "上传文件";
    @Input() inOptions: FileOptions;
    @Output() onSuccess: EventEmitter<any> = new EventEmitter();
    private defaultOptions: FileOptions = new FileOptions();
    private _options: FileOptions = new FileOptions();
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChanges(changes, 'inOptions')) {
            this._options = Object.assign({}, this.defaultOptions, this.inOptions);
        }
    }
    ngOnInit(): void {

    }
    uploadFile() {
        this.initUploader(this._options);
        this.uploadEl = this.el.nativeElement.querySelector('#fileUp')
        $(this.uploadEl).click();
    }

    initUploader(options) {
        let fileTypes = options.fileTypes, fileSize = options.fileSize, url = options.url, method = options.method;
        let uploader = this.uploader = new FileUploader({
            url: url,
            method: method,
            headers: [{ name: "X-XSRF-TOKEN", value: this.token }],
            itemAlias: "file",
            maxFileSize: fileSize,
            /**无法通过过滤器的文件会触发 onWhenAddingFileFailed*/
            filters: [{
                /**文件类型过滤 */
                name: "file-type", fn: (item: FileLikeObject, options: FileUploaderOptions): boolean => {
                    let name = item.name.split("."), len = name.length, type = name[len - 1];
                    if (!fileTypes || fileTypes.length === 0 || fileTypes.includes(type)) {
                        return true
                    } else {
                        return false
                    }
                }
            }],

        });
        uploader.onWhenAddingFileFailed = (item, filter, options) => {
            console.log(item, filter, options)
        };
        uploader
        uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            console.log('goods.httpError')
        };
        uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            var res = JSON.parse(response);
            if (res.rlt === 0) {
                let datas = res.datas;
                this.onSuccess.emit(datas)
            }
        };
        uploader.onBuildItemForm = (fileItem: FileItem, form: any) => {
        };
        uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
            console.log(fileItem, progress)
        };
    }

    selectedFileOnChanged() {
        this.uploader.uploadAll();
    };
}

export class FileOptions {
    /**允许文件上传的类型  空数组标识所有类型都可以上传*/
    fileTypes: string[] = [];
    /**允许文件上传的大小 默认10M  设置为undefined无限制*/
    fileSize: number = 1024 * 1024 * 10;
    /**上传后台路径*/
    url: string = '/api/Content/upload';
    /**上传方式 */
    method: string = "POST";
}