<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KanbanController;

Route::get('/boards', [KanbanController::class, 'getBoards']);
Route::get('/boards/{id}', [KanbanController::class, 'getBoard']);
Route::post('/boards', [KanbanController::class, 'createBoard']);

Route::post('/boards/{board}/lists', [KanbanController::class, 'createList']);
Route::post('/lists/{list}/cards', [KanbanController::class, 'createCard']);
Route::patch('/cards/{card}/move', [KanbanController::class, 'moveCard']);
Route::patch('/cards/{card}/due-date', [KanbanController::class, 'updateDueDate']);

Route::get('/tags', [KanbanController::class, 'getTags']);
Route::get('/members', [KanbanController::class, 'getMembers']);

Route::post('/cards/{card}/tags', [KanbanController::class, 'assignTag']);
Route::post('/cards/{card}/members', [KanbanController::class, 'assignMember']);

Route::get('/seed', [KanbanController::class, 'seed']);

Route::patch('/cards/{card}', [KanbanController::class, 'updateCard']);
Route::delete('/cards/{card}', [KanbanController::class, 'deleteCard']);
Route::delete('/cards/{card}/tags/{tag}', [KanbanController::class, 'removeTag']);
Route::delete('/cards/{card}/members/{member}', [KanbanController::class, 'removeMember']);

Route::get('/health', fn() => response()->json(['status' => 'ok', 'time' => now()]));
