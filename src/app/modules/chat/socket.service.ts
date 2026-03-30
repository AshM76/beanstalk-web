import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  // "http://192.168.0.2:3000"   //TEST: https://beanstalk.app
  io = io("https://beanstalk.app",{
    withCredentials: true,
    autoConnect: true,
  })

  constructor() {
    // this.io.emit("message", "Hola Servidor!")

    this.io.on("message", ( message )=> {
      // alert(message)
      console.log(message);
    })

   }
}
