
import { Component, OnInit} from '@angular/core';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
    providers: []
})
export class HeaderComponent implements OnInit {
    title = '雄安白洋淀数字航道系统';
    constructor(
    ) { }

    ngOnInit() {

    }

    logout() {
    }

}
