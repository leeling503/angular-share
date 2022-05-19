import { Component } from "@angular/core";

@Component({
    templateUrl: './ex-share-input.component.html',
    styleUrls: ['./ex-share-input.component.less']
})
export class ExShareInputComponent {
    valueA = "深蓝信息科技开发有限公司"
    valueB = 918;
    valueC = -0.51898;
    lnglat = [37, 52, 18.56];
    reg: RegExp;
    onChange($event) {
        console.log('ExShareInputComponent', $event, this.lnglat)
    }
}