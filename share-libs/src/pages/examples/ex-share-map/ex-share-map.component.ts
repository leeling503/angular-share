import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LeafletHeatLayer } from 'share-libs/assets/leaflet/leaflet-heat-map';
import { ExMapService } from './ex-share-map.service';
@Component({
  selector: 'app-ex-share-map',
  templateUrl: './ex-share-map.component.html',
  styleUrls: ['./ex-share-map.component.less']
})
export class ExShareMapComponent implements OnInit {
  map: L.Map;
  heatMap = new LeafletHeatLayer({ ifTip: false })
  constructor(private exMap_: ExMapService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    setTimeout(() => {
      this.heatMap.addTo(this.map);
      console.log(this.map.getBounds())
      this.cdr.detectChanges();
      let bounds = this.map.getBounds(), north = bounds.getNorthEast(), south = bounds.getSouthWest();
      let data = {
        lat: north.lat,
        lat1: south.lat,
        lng: north.lng,
        lng1: south.lng,
      }
      this.exMap_.getShips(data).subscribe(res => {
        console.log(res)
      })

      this.map.on('zoomend', () => {
        this.getShipByBounds();
      });
    }, 1000);
  }

  ngAfterViewInit(): void {

  }

  getShipByBounds() {
    let bounds = this.map.getBounds(), north = bounds.getNorthEast(), south = bounds.getSouthWest();
    let data = {
      lat: north.lat,
      lat1: south.lat,
      lng: north.lng,
      lng1: south.lng,
    }
    this.exMap_.getShips(data).subscribe(res => {
      console.log(res)
      if (res.rlt == 0) {
        let datas = res.datas;
        let data = datas.map(e => { return [e.c, e.b] });
        this.heatMap.setLatLngs(data);
      }
    })
  }


}
