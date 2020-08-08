import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bloquesHorarios',
  templateUrl: './bloquesHorarios.component.html',
  styleUrls: ['./bloquesHorarios.component.css']
})
export class BloquesHorariosComponent implements OnInit {

  isVisible = false;

  listOfData = [
    {
      id: 1,
      clase_dia: 'Laborable',
      pp_totalhoras: 10,
      pp_horario: '10 a 16, 18 a 22',
      pi_totalhoras: 9,
      pi_horario: '5 a 10, 16 a 18, 22 a 24',
      pv_totalhoras: 5,
      pv_horario: '0 a 5'
    },
    {
      id: 1,
      clase_dia: 'Sabado',
      pp_totalhoras: 10,
      pp_horario: '10 a 16, 18 a 22',
      pi_totalhoras: 9,
      pi_horario: '5 a 10, 16 a 18, 22 a 24',
      pv_totalhoras: 5,
      pv_horario: '0 a 5'
    },
    {
      id: 1,
      clase_dia: 'Domingo o Feriado',
      pp_totalhoras: 10,
      pp_horario: '10 a 16, 18 a 22',
      pi_totalhoras: 9,
      pi_horario: '5 a 10, 16 a 18, 22 a 24',
      pv_totalhoras: 5,
      pv_horario: '0 a 5'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

}
