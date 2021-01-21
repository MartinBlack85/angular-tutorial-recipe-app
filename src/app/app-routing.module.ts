import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


// Lasy-loading: loadChildren: a special property in route config: the related modules will only be loaded if the user visits the related route
// loadChildren: old syntax: contains file path to the related module and the attached classname of the module: './file/file/module#ModulClassName'
// loadChildren: new syntax: () => import('file path of the module').then(module =y module.moduleClassName)
// all the related codes will be in a different code bundle and will be loaded based on the visited route
const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { 
    path: 'recipes', 
    loadChildren: () => import('./recipes/recipes.module').then(module => module.RecipesModule)
  },
  {
    path: 'shopping-list',
    loadChildren: () => import('./shopping-list/shopping-list.module').then(module => module.ShoppingListModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
  }
];

// configure the preloading of lazy-loading by using the forRoot {preloadingStrategy: }
// we get fast initial pre load and fast subsequent loads for the subsequently loaded modules
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}