import { Component } from "@angular/core";

@Component({
    selector: "ex-share-three-model",
    templateUrl: './ex-share-three-model.component.html',
    styleUrls: ['./ex-share-three-model.component.less']
})
export class ExShareThreeModelComponent { 
    modelName:string = "box" ;
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        setTimeout(() => {
            this.modelName = 'ship2'
        }, 5000);
    }
}