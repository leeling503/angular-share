import { Directive, Input, SimpleChanges } from "@angular/core";
import { MapName } from "share-libs/src/components/map/model";
import { UtilChanges, UtilChangesValue } from "share-libs/src/utils";
declare var NetMap;
@Directive({
    selector: '[inMap]',
})
export class MapBaseDirective {
    constructor() { }
    @Input() inMapName: MapName = "GaoDe.Normal.Map";
    @Input() inMap: any;
    curMap: any;
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChanges(changes, 'inMapName')) {
            this.showCurMap()
        }
    }
    ngOnInit(): void {
        this.showCurMap();
    }

    showCurMap() {
        this.curMap && this.curMap.remove();
        this.curMap = NetMap(this.inMapName);
        this.curMap.addTo(this.inMap)
    }

}