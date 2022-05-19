import { SimpleChanges } from "@angular/core";
import { Directive, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import * as L from "leaflet";
import { LeafletAnimatLayer, ParticleInfo } from "share-libs/assets/leaflet/leaflet-animat-layer";
import { LeafletCanvasMap } from "share-libs/assets/leaflet/leaflet-canvas-map";
import { UtilChangesValue } from "share-libs/utils";

@Directive({
    selector: '[share-map-animat],[map-animat]'
})
export class MapAnimatDirective {
    constructor(private el: ElementRef) { }
    @Input() map: L.Map;
    leafletAnimat: LeafletAnimatLayer = new LeafletAnimatLayer({ className: 'leaflet-animat', zIndex: 400 });
    animatLines: LeafletCanvasMap = new LeafletCanvasMap();

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (UtilChangesValue(changes, 'map')) {
            this.leafletAnimat.addTo(this.map);
            this.animatLines.addTo(this.map);
            this.initAnimat();
        }
    }
    ngOnInit(): void { }
    initAnimat() {
        let parts: ParticleInfo[] = [
            {
                latlngs: [[39.0019694, 117.688788], [38.5855695, 119.715833]],
                degree: 0.3, speed: 0.002, length: 20,
            },
            {
                latlngs: [[40.29655075, 122.10762787], [39.0019694, 117.688788], [39.0019694, 112.688788]],
                degree: 0.5, speed: 0.002, length: 0.1, colorLine: 'red', colorParticle: 'cyan',
            },
            {
                latlngs: [[38.06863403, 118.94127655], [39.0019694, 117.688788], [39.7019694, 117.688788]],
                degree: 0.7, speed: 0.002, length: 20, colorLine: 'green', colorParticle: 'yellow'
            }
            ,
            {
                latlngs: [[39.0019694, 116.688788], [39.0019694, 117.688788]],
                degree: 1, speed: 0.001, length: 20, colorLine: 'purple',
            }
        ];
        this.animatLines.setAllBezierLines(parts)
        this.leafletAnimat.setAllParticles(parts)
    }
}