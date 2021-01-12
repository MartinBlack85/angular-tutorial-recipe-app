import { Component, OnInit } from '@angular/core';

import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeService]
})
export class RecipesComponent implements OnInit {

  constructor() { }

  //Setting up the subscriber to the RecipeSerices event, emitted from the RecipeItemComponent - deleted
  ngOnInit(): void {}

}
