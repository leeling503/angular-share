import { interval, Subscription, timer } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UtilIsEmpty } from 'share-libs/utils';
import { SL_REGEXP } from 'share-libs/const';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'share-libs/services/auth.service';
import { HttpResult } from 'share-libs/models';
const INFO = {
  NULL_PHONE_NUMBER: '手机号码不能为空',
  ERROR_PHONE_NUMBER: '请输入正确的手机号码',
  CODE_HAS_SEND: '验证码已发送，请注意查收',
  CODE_SEND_ERROR: '验证码发送失败，请稍后再试'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private login_: LoginService,
    private auth_: AuthService,
    private router: Router,
  ) { }
  // test 提交
  user: LoginUser = new LoginUser();

  codeTime = 0;//获取验证码间隔时间
  errorInfo = '';//登录错误信息
  loginState: boolean = true;//登录过程是否结束
  phoneValidateReg: RegExp;
  private websocketSub$: Subscription;
  @ViewChild('QRCodeEle', { read: ElementRef, static: false }) QRCodeEle: ElementRef;
  @ViewChild('codeElement', { static: false }) codeElement: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.loginInit();
  }

  loginInit() {
    this.phoneValidateReg = SL_REGEXP.phone.reg;
    this.errorInfo = '';
    this.loginState = true;
    this.user.userName = localStorage.getItem('phone');
    if (!environment.production) {
      this.user.code = '1234';
    }
  }

  onFocus(value) {
    if (!UtilIsEmpty(value)) this.errorInfo = '';
  }

  onBlur(value) {
    this.errorInfo = '';
    this.isPhoneValidate(value);
  }

  isPhoneValidate(value: string) {
    if (!UtilIsEmpty(value)) {
      let result = value.match(this.phoneValidateReg) != null;
      this.errorInfo = result ? '' : INFO.ERROR_PHONE_NUMBER;
      return result;
    }
    this.errorInfo = INFO.NULL_PHONE_NUMBER;
    return false;
  }

  //获取手机验证码
  async getPcode(validate) {
    if (validate) return;
    this.errorInfo = '';
    this.codeTime = 60;
    let $time = interval(1000).pipe(
      take(60),
      map(e => 59 - e)
    ).subscribe(num => {
      this.codeTime = num;
    })
    let res = await this.login_.getPhoneCode(this.user.userName)
    if (res.rlt == 0) {
      if (this.codeElement) this.codeElement.nativeElement.focus();
      this.errorInfo = INFO.CODE_HAS_SEND;
    } else {
      this.user.code = '';
      this.errorInfo = res.info ? res.info : INFO.CODE_SEND_ERROR;
      this.codeTime = 0;// 不用计时
      $time.unsubscribe()
    }
  }

  /**
   * 登录并授权  login true 手机号登录，false 手机端二维码扫描登录
   */
  async loginAndAuth(phone = true) {
    this.errorInfo = '';
    this.loginState = false;
    if (phone) {
      let res = await this.login();
      if (!res || res.rlt == 1) {
        this.errorInfo = res && res.info || '系统异常';
        this.loginState = true;
        return;
      }
      localStorage.setItem('phone', this.user.userName);
    }
    let res = await this.auth_.authorization(this.user)
    this.loginState = true;
    if (res.rlt == 0) { // 登录鉴权成功
      this.router.navigateByUrl("/layout");
    }
  }

  /**登录验证账号 */
  login(): Promise<HttpResult> {
    const phoneNumber = this.user.userName;
    const code = this.user.code;
    return this.login_.login(phoneNumber, code)
  }
  /**
   * 切换登录模式
   */
  async switchQrPhone() {
    if (this.user.submitType == 1) {
      this.user.submitType = 2; //切换为二维码登录
      let res = await this.login_.getQRCode().toPromise();
      if (res && res.rlt == 0) {
        let uuid = res.datas;
        this.genQRCode(uuid);
        this.websocketConnect(uuid);
      }
    } else {
      this.user.submitType = 1;
    }
  }

  /**
   * 连接 websocket
   * @param uuid 
   */
  websocketConnect(uuid) {
    // this.websocketSub$ = this.loginService.connect(uuid).subscribe(res => {
    //   let userId = res.toString().replace(/\"/g, "");
    //   this.user.userName = userId;
    //   this.user.code = '1';
    //   this.login(false);
    // })
  }
  /**
    * 根据id生成二维码
    */
  genQRCode(uuid) {
    let ele: HTMLImageElement = this.QRCodeEle.nativeElement;
    // QRCode.toDataURL(uuid)
    //   .then(url => {
    //     console.log('qrcode url', url)
    //     ele.src = url;
    //   })
    //   .catch(err => {
    //     console.error(err)
    //   })
  }

  ngOnDestroy(): void {
    if (this.websocketSub$) {
      this.websocketSub$.unsubscribe();
    }
  }
}

class LoginUser {
  id: string;
  userName: string;
  password: string;
  phone: string;
  code: string;// 手机验证码
  roleType: number;
  description: string;
  remeberMe?: boolean;
  imageCode?: string;
  submitType: number = 1;// 1,手机号，2扫码
}
