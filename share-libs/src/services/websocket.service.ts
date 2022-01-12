// import { HttpClient } from '@angular/common/http';
// import {Injectable } from "@angular/core";
// import { GetWebSocketResponses } from 'rxjs-websockets';
// import { QueueingSubject } from 'queueing-subject'
// import { share, switchMap} from 'rxjs/operators'
// import makeWebSocketObservable, { WebSocketOptions } from 'rxjs-websockets'
// import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
// declare type WebSocketPayload = string | ArrayBuffer | Blob;
// @Injectable({providedIn:'root'})
// export class WebSocketService {
//     marker$: Subject<any> = new Subject();//操作栏选中值的变化
//     oneLiData$: BehaviorSubject<any> = new BehaviorSubject(false);//实时数据变化
//     baseUrl: string = '';
//     constructor(private http: HttpClient) { }
//     input$ = new QueueingSubject<any>()
//     url: string = 'websocket';
//     socket$;
//     messages$: Observable<any>

//     getInput() {
//         return this.input$;
//     }

//     connect() {
//         this.messages$ = this.socket$.pipe(
//             switchMap((getResponses: GetWebSocketResponses) => {
//                 return getResponses(this.input$)
//             }),
//             // retryWhen(errors => errors.pipe(
//             //     delay(10000)
//             // )),
//             share(),
//         );
//     }

//     subMessages$: Subscription
//     connectWebSocket(websocketUrl: string): Promise<any> {
//         return new Promise((r, j) => {
//             this.socket$ = makeWebSocketObservable(websocketUrl);
//             if (!this.messages$) this.connect();
//             r(this.messages$)
//         });
//     }

// }