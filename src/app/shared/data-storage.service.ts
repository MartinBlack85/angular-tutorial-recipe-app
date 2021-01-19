import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from "../auth/auth.service";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

    // saving data to the backend
    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        //put request will overwrite all data on the backend, the url's api endpoint is configured to Firebase requirements
        this.http.put('https://angular-recipe-tutorial-app-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
            console.log(response);
        });
    }

    // getting data from the backend
    // need to use the get method's generic feature to infrom Angular about the type of the returned request body
    // using the rxjs operator map() function on the observable to transform the input data (adding ingredients array)
    // second map() function is a javascript array function (allows to transform the elements in an array)
    // this take function will get the latest user object from the BehaviorSubject observable, getting the object here only once
    fetchRecipes() {
        
        return this.http.get<Recipe[]>('https://angular-recipe-tutorial-app-default-rtdb.firebaseio.com/recipes.json' 
        ).pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        );
    }
}