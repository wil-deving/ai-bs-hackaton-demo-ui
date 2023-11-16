import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OamAssistantChatComponent } from './views/oam-assistant-chat/oam-assistant-chat.component';

const routes: Routes = [
  { path: 'oam-assistant-chat', component: OamAssistantChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
