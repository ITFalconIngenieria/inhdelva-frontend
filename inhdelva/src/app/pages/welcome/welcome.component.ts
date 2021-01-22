import { UserService } from './../../servicios/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  isCollapsed = false;
  menu: any[] = [];

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {

    this.menu = JSON.parse(localStorage.getItem('menu'));

    console.log(this.menu);

  }

  salir() {
    this.userService.clearInfoLogin();
  }

}
