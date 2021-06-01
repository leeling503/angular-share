import { Component, Input, ElementRef, HostListener, NgZone } from "@angular/core";
import flvjs from 'flv.js';
//"flv.js": "^1.5.0",
@Component({
    selector: "share-view-flv",
    templateUrl: './share-view-flv.component.html',
    styleUrls: ['./share-view-flv.component.less'],
})
export class ShareViewFlvComponent {
    @Input() inFlvUrl: string = "";
    /**加载就播放 */
    autoPlay: boolean = true;
    /**播放器 */
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
        this.createPlayer(this.autoPlay);
    }

    ngOnDestroy(): void {
        this.stoppush();
    }

    /**页面控制按钮 */
    onFlvPlayCtr() {
        if (this.flvPlayer === null) {
            return
        }
        if (this.flvPauseFlag === true) {
            this.flvPlay();
        } else {
            this.flvPause()
        }
    }

    /**重新加载 */
    reloadFlv() {
        if (!this.flvStop) {
            this.stoppush();
        }
        this.createPlayer(false);
    }

    /**创建播放器 */
    createPlayer(play = true) {
        this.flvStop = !play;
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
            this.getFlvUrl(!play);
        }
    }

    getFlvUrl(pause = true) {
        this.flvPlayer._mediaDataSource.url = this.inFlvUrl;
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

    /**获取播放节点 */
    getPlayEl(): HTMLMediaElement {
        return this.nativeEl.querySelector('#videoElement');
    }

    /**关流*/
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

    /**暂停 */
    flvPause() {
        this.flvPlayer.pause();
        this.flvPauseFlag = true;
    }

    /**播放*/
    flvPlay() {
        this.flvPlayer.play();
        this.flvPauseFlag = false;
    }

    /**全屏 */
    onScreenControl() {
        this.fullScreenFlag = !this.fullScreenFlag;
    }
}