import { Input, Directive, OnInit } from '@angular/core';

@Directive({
  selector: '[myd]'
})
export class MyD implements OnInit {
  @Input() myd: string;
  @Input() mydData: any;
  constructor() { }
  ngOnInit(): void {
    console.log(this.mydData)
  }

}
