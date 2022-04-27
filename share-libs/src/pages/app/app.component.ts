import { Component } from '@angular/core';

//@ts-nocheck
function a(value: boolean): any {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('a()', target, propertyKey, descriptor);
    return target
  }
}

@Component({
  selector: 'app-main',
  template: `<router-outlet></router-outlet>`,
  styles: [
    `:host{width:100%;height:100%}`
  ]
})
export class AppMainComponent {

  b: string;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.test();
  }

  @a(false)
  test() {
    console.log('test')
  }

}
