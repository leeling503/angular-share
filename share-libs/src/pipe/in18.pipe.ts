import { Pipe, PipeTransform } from '@angular/core';
import { Scope } from 'share-libs/const/in18';
import { GlEventService } from '../services/global/gl-event.service';

@Pipe({
  name: 'in18'
})
export class In18Pipe implements PipeTransform {

  constructor(private gl_: GlEventService) {
    
  }

  transform(value: any, args?: any): any {
    return Scope[value];
  }

}
