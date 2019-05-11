<?php


Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/chat','ChatController@chat');
Route::post('/send','ChatController@send');
Route::get('/check',function(){
	return session('chat');
});
Route::post('/getOldMessages','ChatController@getOldMessages');
Route::post('/saveToSession','ChatController@saveToSession');
Route::post('/deleteSession','ChatController@deleteSession');

Route::get('/home', 'HomeController@index')->name('home');
