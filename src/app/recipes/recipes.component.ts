import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  constructor() { }

  //Setting up the subscriber to the RecipeSerices event, emitted from the RecipeItemComponent - deleted
  ngOnInit(): void {}

}
