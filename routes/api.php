<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');

    Route::group([
      'middleware' => 'auth:api'
    ], function() {
        Route::get('logout', 'AuthController@logout');
        Route::get('user', 'AuthController@user');
    });
});

Route::group([
    'middleware' => 'auth:api'
  ], function() {
    Route::middleware('relationship')->group(function() {
        Route::get('fullcalendar/{user_id}','FullCalendarController@index');
        Route::post('fullcalendar/create/{user_id}','FullCalendarController@create');
        Route::post('fullcalendar/update/{user_id}','FullCalendarController@update');
        Route::post('fullcalendar/delete/{user_id}','FullCalendarController@destroy');
    });
  });
