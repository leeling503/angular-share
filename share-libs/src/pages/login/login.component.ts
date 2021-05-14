import { interval, Subscription, timer } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UtilIsEmpty } from 'share-libs/src/utils';
import { REGEXP } from 'share-libs/src/const';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'share-libs/src/services/auth.service';
import { HttpResult } from 'share-libs/src/models';
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
  loginInfo = ''; // 点击登录按钮后台提示的信息
  validateInfo = '';// 前端校验信息
  loginState: boolean;
  phoneValidateReg: RegExp;
  private websocketSub$: Subscription;
  @ViewChild('QRCodeEle', { read: ElementRef, static: false }) QRCodeEle: ElementRef;

  @ViewChild('codeElement', { static: false }) codeElement: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.developmentTest();
    this.loginInit();
  }

  loginInit() {
    this.phoneValidateReg = REGEXP.phone.reg;
    this.validateInfo = '';
    this.loginInfo = '';
    this.loginState = true;
    this.user.userName = localStorage.getItem('phone');
    // if (!environment.production) {
    //   this.user.code = '1234';
    //   this.login(true)
    // }
  }

  onFocus(value) {
    if (!UtilIsEmpty(value)) this.validateInfo = '';
  }

  onBlur(value) {
    this.validateInfo = '';
    this.loginInfo = '';
    this.isPhoneValidate(value);
  }

  isPhoneValidate(value: string) {
    if (!UtilIsEmpty(value)) {
      let result = value.match(this.phoneValidateReg) != null;
      this.validateInfo = result ? '' : INFO.ERROR_PHONE_NUMBER;
      return result;
    }
    this.validateInfo = INFO.NULL_PHONE_NUMBER;
    return false;
  }

  //获取手机验证码
  getPcode(validate) {
    if (validate) return;
    this.loginInfo = '';
    this.login_.getPhoneCode(this.user.userName).then(res => {
      if (res.rlt == 0) {
        if (this.codeElement) this.codeElement.nativeElement.focus();
        this.validateInfo = INFO.CODE_HAS_SEND;
        interval(1000).pipe(
          take(60),
          map(e => 59 - e)
        ).subscribe(num => {
          this.codeTime = num;
        })
      } else {
        this.user.code = '';
        this.loginInfo = res.info ? res.info : INFO.CODE_SEND_ERROR;
        this.codeTime = 0;// 不用计时
      }
    })
  }

  /**
   * 登录并授权  login true 手机号登录，false 手机端二维码扫描登录
   */
  async loginAndAuth(phone = true) {
    this.validateInfo = '';
    this.loginState = false;
    if (phone) {
      let res = await this.login();
      if (!res || res.rlt == 1) {
        this.loginInfo = res && res.info || '系统异常';
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
  switchQrPhone() {
    this.user.submitType = this.user.submitType == 1 ? 2 : 1;
    if (this.user.submitType == 2) { //二维码登录
      this.login_.getQRCode().subscribe((res: any) => {
        if (res && res.rlt == 0) {
          let uuid = res.datas;
          this.genQRCode(uuid);
          this.websocketConnect(uuid);
        }
      })
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
  /**
   * 开发模式下默认使用 13011111111 手机号
   * 验证码 1234
   */
  private developmentTest() {
    if (!environment.production) {
      this.user.userName = '13011111111';
      this.user.code = '1234';
    }
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
