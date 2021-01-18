import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";

import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    
    constructor(private dataStorageService: DataStorageService, private recipesService: RecipeService) {}

    // resolver function will subscribe
    // when the route gets louded, the fetchData method will run and load the data beforehand
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipesService.getRecipes();
        if(recipes.length === 0) {
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        }
        
    }
}