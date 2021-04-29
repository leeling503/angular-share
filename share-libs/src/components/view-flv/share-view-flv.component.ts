import { Component, Input, ElementRef, HostListener, NgZone } from "@angular/core";
import flvjs from 'flv.js';
//"flv.js": "^1.5.0",
@Component({
    selector: "share-view-flv",
    templateUrl: './share-view-flv.component.html',
    styleUrls: ['./share-view-flv.component.less'],
})
export class ShareViewFlvComponent {
    @Input() flvUrl: string = "https://flvopen.ys7.com:9188/openlive/a669042a0b3f496c90e8804dda99d820.flv";
    flvPlayer;
    nativeEl: HTMLElement;
    flvPauseFlag: boolean = true;
    fullScreenFlag: boolean = false;
    flvStop: boolean = false;
    netError: boolean = false;
    constructor(
        private el: ElementRef
    ) {
        this.nativeEl = this.el.nativeElement;
    }

    ngOnInit(): void {
        this.createPlayer(false);
    }

    ngOnDestroy(): void {
        this.stoppush();
    }

    flvPlayCtr() {
        if (this.flvPlayer === null) {
            return
        }
        if (this.flvPauseFlag === true) {
            this.flvPlay();
        } else {
            this.flvPause()
        }
    }

    reloadFlv() {
        if (!this.flvStop) {
            this.stoppush();
        }
        this.createPlayer(false);
    }

    createPlayer(pause = true) {
        this.flvStop = pause;
        this.netError = false;
        if (flvjs.isSupported()) {
            this.flvPlayer = flvjs.createPlayer({
                type: 'flv',        // 指定视频类型
                isLive: true,       // 开启直播
                hasAudio: false,    // 关闭声音
                cors: true,         // 开启跨域访问
                url: "",   // 指定流链接
            });
            this.flvPlayer.on(flvjs.Events.ERROR, (e) => {
                if (e === flvjs.ErrorTypes.NETWORK_ERROR) {
                    this.netError = true;
                    this.stoppush();
                }
            })
            this.getFlvUrl(pause);
        }
    }

    getFlvUrl(pause = true) {
        this.flvPlayer._mediaDataSource.url = this.flvUrl;
        this.flvPlayer.attachMediaElement(this.getPlayEl());
        this.flvPlayer.load();
        this.flvPlayer.play();
        this.flvPauseFlag = false;
        if (pause) {
            setTimeout(() => {
                this.flvPause()
            }, 5000);
        }
    }

    getPlayEl(): HTMLMediaElement {
        return this.nativeEl.querySelector('#videoElement');
    }

    //关流
    @HostListener('window:beforeunload')
    stoppush() {
        if (this.flvStop) {
            return;
        }
        if (this.flvPlayer) {
            this.flvPlayer.unload();
            this.flvPlayer.detachMediaElement();
            this.flvPlayer.destroy();
        }
        this.flvPlayer = null;
    }

    flvPause() {
        this.flvPlayer.pause();
        this.flvPauseFlag = true;
    }

    flvPlay() {
        this.reloadFlv();
        this.flvPauseFlag = false;
    }

    screenControl() {
        this.fullScreenFlag = !this.fullScreenFlag;
    }
}