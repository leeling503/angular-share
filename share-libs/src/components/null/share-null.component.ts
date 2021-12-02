import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'share-null',
  templateUrl: './share-null.component.html',
  styleUrls: ['./share-null.component.less']
})
export class ShareNullComponent implements OnInit {
  /**数据加载中 */
  @Input() inLoad: boolean = false;
  constructor() { }

  ngOnInit() { }

}
