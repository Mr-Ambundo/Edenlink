import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  trainingModules = [
    { id: 1, title: 'Soil Preparation', description: 'Learn how to prepare soil for planting.', duration: '30 mins' },
    { id: 2, title: 'Irrigation Techniques', description: 'Understand efficient irrigation methods.', duration: '45 mins' },
    { id: 3, title: 'Pest Management', description: 'Discover natural pest control techniques.', duration: '40 mins' }
  ];

  constructor() {}

  ngOnInit(): void {}
}