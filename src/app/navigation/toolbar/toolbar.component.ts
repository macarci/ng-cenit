import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'cenit-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  @Output() menuClick = new EventEmitter<any>();

  doClick(){
    this.menuClick.emit();
  }
}
