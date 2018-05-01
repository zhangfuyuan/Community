import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class WebSocketProvider {

  ws: WebSocket;

  constructor() {
  }

  /**
   * 这个方法返回一个流，流中包括服务器推送的消息
   * @param {string} url
   * @returns {Observable<any>}
   */
  createObservableSocket(url: string): Observable<any> {
    this.ws = new WebSocket(url); //创建一个websocket对象，这个对象会根据传进去的url去连接指定的websocket服务器

    this.ws.onopen = (event) => console.log('WebSocket 已打开！');

    return new Observable(
      observer => {
        this.ws.onmessage = (event) => observer.next(event.data);
        this.ws.onerror = (event) => observer.error(event);
        this.ws.onclose = (event) => observer.complete();
      }
    );
  }

  /**
   * 这个方法向服务器发送一个消息
   * @param {string} message
   */
  sendMessage(message: string) {
    this.ws.send(message);
  }
}
