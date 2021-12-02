import { Component, Input, SimpleChanges } from "@angular/core";
import { SwiperOption, SwiperOptions } from "./share-swiper.model";
@Component({
    selector: 'share-swiper',
    templateUrl: './share-swiper.component.html',
    styleUrls: ['./share-swiper.component.less']
})
export class ShareSwiperComponent {
    @Input() inOptions: SwiperOptions = [];
    activeOption: SwiperOption;
    activeIndex: number = 0;
    perIndex: number = 0;
    nexIndex: number = 0;
    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit(): void {
        this.onChangeIndex(0)
    }

    onChangeIndex(num: number) {
        let len = this.inOptions.length, sum = this.activeIndex + num;
        this.activeIndex = sum >= 0 && sum < len ? sum : sum >= 0 ? 0 : len - 1;
        this.activeOption = this.inOptions[this.activeIndex];
    }

    /**改变激活项 */
    onChangeActive(option: SwiperOption, index: number) {
        this.activeOption = option;
        this.activeIndex = index;
    }

}