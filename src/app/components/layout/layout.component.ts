import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    SidebarComponent
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  webSocketService = inject(WebSocketService);

  ngOnInit(): void {
    // this.webSocketService.connectForAnswersInMyQuestion();
    // this.webSocketService.subscribeToAnswersForMyQuestions().subscribe(
    //   // ADD появление уведомлений
    // );
  }

  ngOnDestroy(): void {
    // this.webSocketService.disconnect();
  }
  
}
