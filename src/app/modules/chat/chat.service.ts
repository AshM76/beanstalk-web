import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';

export interface Chat {
  chat_id: string;
  chat_consumer_id: string;
  chat_store_id: string;
  chat_consumer_name: string;
  chat_store_name: string;
  chat_lastMessage: string;
  chat_lastDate: Date;
  chat_unreads: number;
  chat_messages: Message[];
}

export interface Message {
  message_id: string;
  message_date: Date;
  message_content: string;
  message_owner: string;
  message_read: boolean;
  message_type: string;
  message_kind: number;
}

export interface ChatListResponse {
  error: boolean
  message: string
  token: string
  data: {
    chats: Chat[]
  }
}

export interface ChatHistoryResponse {
  error: boolean
  message: string
  token: string
  data: {
    chat: Chat
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl: string = environment.baseUrl;

  chats: Chat[] = [];

  messages: Message[] = [];

  constructor(private http: HttpClient, private socket: SocketService, private _dispensaryService: DispensaryService) {
    this.onReceiveMessage();
    this.onChatConnected();
  }

  joinPrivateChat(chatId: string) {
    //JOIN TO CHAT ROOM
    this.socket.io.emit('joinPrivateChat', chatId);
  }

  onChatConnected() {
    //Listen <- <- [Server]
    this.socket.io.on("chatConnected", (message) => {
      console.log(message);
    });
  }

  onSendMessage(chatId: string, message: Message) {
    var messageSend = {
      "message": message,
      "chatid": chatId,
    }
    //Emit -> -> [Server]
    this.socket.io.emit("sendMessage", messageSend);
    //Save local messages
    this.messages.push(message);
  }

  onReceiveMessage() {
    //Listen <- <- [Server]
    this.socket.io.on("receiveMessage", (message) => {
      //Save local messages
      this.messages.push(message);
    });
  }

  leavePrivateChat() {
    this.socket.io.emit('leavePrivateChat');
  }

  //http://192.168.0.7:8080/api/chat/listbyDispensary/54321
  //GET: Load Chat List
  loadChatList() {

    console.log("::GET/LoadChatList");

    let dispensaryID: string = this._dispensaryService.dispensaryId;;

    const url = `${this.baseUrl}/chat/listbyDispensary/${dispensaryID}`;

    return this.http.get<ChatListResponse>(url)
      .pipe(
        tap(resp => {
          console.log(resp['data'].chats)
          this.chats = [];
          this.messages = [];

          resp['data'].chats.forEach(chat => {

            let tempDate = JSON.parse(JSON.stringify(chat.chat_lastDate));
            let tempChat: Chat = {
              chat_id: chat.chat_id,
              chat_consumer_id: chat.chat_consumer_id,
              chat_store_id: chat.chat_store_id,
              chat_consumer_name: chat.chat_consumer_name,
              chat_store_name: chat.chat_store_name,
              chat_lastMessage: chat.chat_lastMessage,
              chat_lastDate: new Date(tempDate['value']),
              chat_unreads: chat.chat_unreads,
              chat_messages: chat.chat_messages,
            };

            this.chats.push(tempChat);
          });

        }),
        map(resp => resp),
        catchError(err => of(err))
      )
  }

  //http://192.168.0.7:8080/api/chat/history/12345/54321
  //GET: Load Chat History
  loadChatHistory(consumerId: string, storeId: string) {

    console.log("::GET/LoadChat");
    let dispensaryID: string = this._dispensaryService.dispensaryId;

    console.log({ consumerId, dispensaryID, storeId });

    const url = `${this.baseUrl}/chat/history/${consumerId}/${dispensaryID}/${storeId}/1`;

    return this.http.get<ChatHistoryResponse>(url)
      .pipe(
        tap(resp => {
          console.log(resp['data'].chat)
          this.messages = [];

          resp['data'].chat.chat_messages.forEach(message => {

            let tempDate = JSON.parse(JSON.stringify(message.message_date));
            let tempMessage: Message = {
              message_id: message.message_id,
              message_date: new Date(tempDate['value']),
              message_content: message.message_content,
              message_owner: message.message_owner,
              message_read: message.message_read,
              message_type: message.message_type,
              message_kind: message.message_kind,
            };

            this.messages.push(tempMessage)
          })
          console.log('Messages->')
          console.log(this.messages)

        }),
        map(resp => resp),
        catchError(err => of(err))
      )
  }

}
