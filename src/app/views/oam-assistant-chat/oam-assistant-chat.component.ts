import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as data from './b164.json';

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
  /*
  messageHistory: MessageHistory[] = [
    {
      id: 1,
      owner: 'Pepito',
      time: 'Enviado ' + this.getCurrentDate(),
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
  */

  messageHistory: MessageHistory[] = [];

  isUserKnoww: boolean = false;
  isLoding: boolean = false;
  MessageFieldsform: FormGroup;
  StartFieldsform: FormGroup;
  textMessage = new FormControl('', Validators.required);
  docNo = new FormControl('', Validators.required);
  fieldMessage: string = 'Hello';
  value: string = 'Hello';

  // Datos usuario
  user: string = '';
  policyNo: string = '';

  // Data audio
  isVoice: boolean = false;
  globalAudioChunks: any[] = [];
  globalMediaRecorder: MediaRecorder | null = null;
  isRecording: boolean = false;

  // Data reproduccion audio
  jsonData: any = data;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private _sanitizer: DomSanitizer,
    private http: HttpClient
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
    this.StartFieldsform = this.formBuilder.group(
      {
        docNo: this.docNo,
      },
      {
        // ex: validator: this.MustMatch('password', 'repeatPassword'), // Validando
      }
    );
  }

  ngOnInit(): void {
    // Puedes acceder a tu data JSON aquí
    //console.log(this.jsonData.content);
  }

  onSubmitStartForm() {
    const parameters = { ...this.StartFieldsform.value };
    console.log('Form Fields', parameters.docNo);

    this.apiService.getInsuredData(parameters).subscribe((data) => {
      console.log('DEV2', data);
      if (data.policyNo) {
        this.isUserKnoww = true;
        this.user = data.fullName;
        this.policyNo = data.policyNo;
        window.alert(
          `Hola ${data.fullName}! ya puedes chatear con el asistente inteligente`
        );
      } else {
        window.alert('No encontre una poliza registrada para tu carnet.');
      }
    });
  }

  onSubmitChatMessage() {
    if (this.isVoice) {
      this.onStopMediaRecording();
    } else {
      const formFields = { ...this.MessageFieldsform.value };

      const parameters = {
        policyNo: this.policyNo,
        message: formFields.textMessage,
      };

      const userNewMessage = {
        id: this.messageHistory.length + 1,
        owner: this.user,
        time: `Enviado ${this.getCurrentDate()}`,
        message: formFields.textMessage,
        order: this.messageHistory.length + 1,
        isUser: true,
      };

      this.messageHistory.push(userNewMessage);
      this.textMessage.setValue('');
      this.isLoding = true;

      this.apiService.sendMessage(parameters).subscribe((data) => {
        console.log('DEV', data);

        let textWorked = data.content + '';
        const finalText = textWorked.replace('PDF', 'Contrato');

        const bisaNewMessage = {
          id: this.messageHistory.length + 1,
          owner: 'Bisa Seguros',
          time: `Enviado ${this.getCurrentDate()}`,
          message: finalText,
          order: this.messageHistory.length + 1,
          isUser: false,
        };

        this.messageHistory.push(bisaNewMessage);

        const parameterAudio = {
          b64mp3: finalText,
        };
        this.apiService.text2Voice(parameterAudio).subscribe((data2) => {
          console.log('DEV2', data2.b64mp3);
          this.isLoding = false;

          // audio
          const decodedData = atob(data2.b64mp3);
          // Convertir la cadena decodificada en un array de bytes
          const byteArray = new Uint8Array(decodedData.length);
          for (let i = 0; i < decodedData.length; i++) {
            byteArray[i] = decodedData.charCodeAt(i);
          }
          // Crear un Blob con el array de bytes y el tipo de archivo
          const blob = new Blob([byteArray], { type: 'audio/mp3' });

          // Puedes ahora usar el objeto Blob según tus necesidades
          console.log(blob);

          const audioPlayer = document.getElementById(
            'audioPlayer'
          ) as HTMLAudioElement;
          audioPlayer.src = URL.createObjectURL(blob);
          audioPlayer.play();
        });

        //this.messageHistory.push(userNewMessage);
      });
    }
  }

  recordAudio() {
    console.log('DEV star recording');
    this.isVoice = true;
    this.isRecording = true;
    let mediaRecorder: any;
    let audioChunks: any = [];

    const startRecordingButton = document.getElementById('startRecording');
    //const stopRecordingButton = document.getElementById('stopRecording');
    //const playRecordingButton = document.getElementById('playRecording');
    //const downloadRecordingButton =
    //document.getElementById('downloadRecording');
    const audioPlayer = document.getElementById(
      'audioPlayer'
    ) as HTMLAudioElement;

    const constraints = { audio: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event: any) => {
          console.log('DEV on event');

          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          console.log('DEV on stop');
          //debugger;
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });

          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(audioBlob);
          downloadLink.download = 'grabacion.mp3';
          downloadLink.click();

          audioPlayer.src = URL.createObjectURL(audioBlob);
          audioChunks = [];
        };

        startRecordingButton!.addEventListener('mousedown', () => {
          console.log('DEV on start');
          mediaRecorder.start();
        });

        startRecordingButton!.addEventListener('mouseup', () => {
          mediaRecorder.stop();
        });

        /*
        playRecordingButton.addEventListener('click', () => {
          audioPlayer.play();
        });

        downloadRecordingButton.addEventListener('click', () => {
          downloadRecording();
        });
        */

        function downloadRecording() {
          debugger;
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });

          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(audioBlob);
          downloadLink.download = 'grabacion.mp3';
          downloadLink.click();
        }
      })
      .catch((error) => {
        console.error('Error al obtener acceso al micrófono:', error);
      });
  }

  onStopMediaRecording() {
    this.globalMediaRecorder?.stop();
    const audioBlob = new Blob(this.globalAudioChunks, { type: 'audio/mp3' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(audioBlob);
    downloadLink.download = 'grabacion.mp3';
    downloadLink.click();
  }

  getCurrentDate() {
    const fechaActual = new Date();

    // Obtiene las horas, minutos y segundos
    const horas = fechaActual.getHours().toString().padStart(2, '0');
    const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
    const segundos = fechaActual.getSeconds().toString().padStart(2, '0');

    // Formatea la hora
    const horaFormateada = `${horas}:${minutos}:${segundos}`;

    console.log('Hora actual en formato HH:mm:ss:', horaFormateada);

    return horaFormateada;
  }
}
