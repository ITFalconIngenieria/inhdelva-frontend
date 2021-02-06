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
    if (localStorage.getItem('menu')) {
      this.menu = JSON.parse(localStorage.getItem('menu'));

    } else {
      console.log('Error');

    }
  }

  salir() {
    this.userService.clearInfoLogin();
  }

}
