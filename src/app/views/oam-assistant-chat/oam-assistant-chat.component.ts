import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

export interface MessageHistory {
  id: number;
  message: string;
  order: number;
  isUser: boolean;
  owner: string;
  time: string;
}

@Component({
  selector: 'app-oam-assistant-chat',
  templateUrl: './oam-assistant-chat.component.html',
  styleUrls: ['./oam-assistant-chat.component.css'],
})
export class OamAssistantChatComponent implements OnInit {
  messageHistory: MessageHistory[] = [
    {
      id: 1,
      owner: 'Pepito',
      time: 'Enviado: 10:13 a.m.',
      message: 'Hola mi nombre es DEV',
      order: 1,
      isUser: true,
    },
    {
      id: 2,
      owner: 'Bisa Seguros',
      time: 'Enviado: 10:13 a.m.',
      message: 'Hola mi nombre es Bisa',
      order: 1,
      isUser: false,
    },
  ];

  //messageHistory: MessageHistory[] = [];
  MessageFieldsform: FormGroup;
  textMessage = new FormControl('', Validators.required);
  fieldMessage: string = 'Hello';
  value: string = 'Hello';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    console.log('text Form');
    this.MessageFieldsform = this.formBuilder.group(
      {
        textMessage: this.textMessage,
      },
      {
        // ex: validator: this.MustMatch('password', 'repeatPassword'), // Validando
      }
    );
  }

  ngOnInit(): void {}

  onSubmit() {
    const parameters = { ...this.MessageFieldsform.value };
    console.log('Form Fields', parameters);

    const userNewMessage = {
      id: this.messageHistory.length + 1,
      owner: 'Pepito',
      time: 'Enviado: 10:13 a.m.',
      message: parameters.textMessage,
      order: this.messageHistory.length + 1,
      isUser: true,
    };

    this.messageHistory.push(userNewMessage);
    this.textMessage.setValue('');

    this.apiService.sendMessage(parameters).subscribe((data) => {
      console.log('DEV', data);

      const userNewMessage = {
        id: this.messageHistory.length + 1,
        owner: 'Bisa Seguros',
        time: 'Enviado: 10:13 a.m.',
        message: data.answer,
        order: this.messageHistory.length + 1,
        isUser: false,
      };

      this.messageHistory.push(userNewMessage);
    });
  }
}
