import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareNullModule } from "../null/share-null.module";
import { ShareSwiperComponent } from "./share-swiper.component";

@NgModule({
    declarations: [ShareSwiperComponent],
    imports: [CommonModule, ShareNullModule],
    exports: [ShareSwiperComponent],
})
export class ShareSwiperModule { }