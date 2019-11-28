<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware('auth')->group(function() {
    Route::get('/', function () {
        return redirect('/users');
    });
    Route::resource('/users', 'UserController');

    Route::middleware('relationship')->group(function() {
        Route::get('fullcalendar/{user_id}','FullCalendarController@index');
        Route::post('fullcalendar/{user_id}/create','FullCalendarController@create');
        Route::post('fullcalendar/{user_id}/update','FullCalendarController@update');
        Route::post('fullcalendar/{user_id}/delete','FullCalendarController@destroy');
    });
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');


