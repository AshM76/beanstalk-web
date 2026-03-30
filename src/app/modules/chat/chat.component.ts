import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/core/auth/auth.service';
import { Chat, ChatService, Message } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  text: string = '';

  currentIndex: number = 0;

  public currentChat: Chat = {
    chat_id: "",
    chat_consumer_id: "",
    chat_store_id: '',
    chat_consumer_name: "",
    chat_store_name: "",
    chat_lastMessage: "",
    chat_lastDate: new Date(),
    chat_unreads: 0,
    chat_messages: [],
  }

  public selectChat(chat: Chat, index: number) {

    this.currentChat = chat;
    this.currentIndex = index;

    this.chat.leavePrivateChat();
    this.loadChatHistory(chat);
  }


  constructor(
    public chat: ChatService,
    private spinner: NgxSpinnerService,
    private _authService: AuthService
  ) { }

  showError: boolean = false;
  messageError: string = "Chat list Error";

  ngOnInit(): void {
    this.loadChatList();
    this.currentChat = {
      chat_id: "",
      chat_consumer_id: "",
      chat_store_id: '',
      chat_consumer_name: "",
      chat_store_name: "",
      chat_lastMessage: "",
      chat_lastDate: new Date(),
      chat_unreads: 0,
      chat_messages: [],
    };
    this.currentIndex = -1;
  }

  sendMessage() {
    if (this.text) {
      let message: Message = {
        message_id: 'web',
        message_date: new Date(),
        message_content: this.text,
        message_owner: this._authService.accountUsername,
        message_read: false,
        message_type: "text",
        message_kind: 2,
      };

      this.chat.onSendMessage(this.currentChat.chat_id, message);
      this.text = "";
    }
  }

  loadChatList() {
    this.showError = false;
    this.messageError = '';
    this.spinner.show();

    this.chat.loadChatList()
      .subscribe(resp => {
        if (resp['error']) {
          this.showError = true;
          this.messageError = resp['error']['message'] ?? resp['name'];
        } else {
          // console.log(resp);
          // this.routing.navigateByUrl('/dashboard');
          // alert('Uploaded Message')
        }
        this.spinner.hide();
      },
      );
  }

  loadChatHistory(chat: Chat) {
    this.showError = false;
    this.messageError = '';
    this.spinner.show();

    this.chat.loadChatHistory(chat.chat_consumer_id, chat.chat_store_id)
      .subscribe(resp => {
        if (resp['error']) {
          this.showError = true;
          this.messageError = resp['error']['message'] ?? resp['name'];
        } else {
          // console.log(resp);
          // this.routing.navigateByUrl('/dashboard');
          // alert('Uploaded Message')
          this.chat.joinPrivateChat(this.currentChat.chat_id);
        }
        this.spinner.hide();
      },
      );
  }

}
