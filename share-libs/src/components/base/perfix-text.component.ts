import { Component, Input, SimpleChanges } from "@angular/core";
import { UtilChanges } from "share-libs/src/utils";

export class PerfixText {
    @Input() inPerText: string;
    @Input() inPerWidth: string;
    _perText: string;
    _perWidth: string;
    ngPerfixChange(changes: SimpleChanges) {
        if (UtilChanges(changes, 'inPerText')) {
            this._perText = this.inPerText
        }
        if (UtilChanges(changes, 'inPerWidth')) {
            this._perWidth = this.inPerWidth
        }
    }
}