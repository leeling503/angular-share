import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LeafletHeatLayer } from 'share-libs/assets/leaflet/leaflet-heat-map';
import { ExMapService } from './ex-share-map.service';
@Component({
  selector: 'app-ex-share-map',
  templateUrl: './ex-share-map.component.html',
  styleUrls: ['./ex-share-map.component.less']
})
export class ExShareMapComponent {
  map: L.Map;
  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void { }
}
