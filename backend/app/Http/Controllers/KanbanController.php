<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Board;
use App\Models\KanbanList;
use App\Models\Card;
use App\Models\Tag;
use App\Models\Member;

class KanbanController extends Controller
{
    public function getBoards()
    {
        return Board::all();
    }

    public function getBoard($id)
    {
        return Board::with(['kanbanLists.cards.tags', 'kanbanLists.cards.members'])->findOrFail($id);
    }

    public function createBoard(Request $request)
    {
        $board = Board::create($request->validate(['title' => 'required|string']));
        return response()->json($board, 201);
    }

    public function createList(Request $request, $boardId)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'position' => 'integer'
        ]);
        $data['board_id'] = $boardId;
        return response()->json(KanbanList::create($data), 201);
    }

    public function createCard(Request $request, $listId)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'position' => 'integer'
        ]);
        $data['kanban_list_id'] = $listId;
        $card = Card::create($data);
        return response()->json($card->load('tags', 'members'), 201);
    }

    public function moveCard(Request $request, $cardId)
    {
        $card = Card::findOrFail($cardId);
        $data = $request->validate([
            'kanban_list_id' => 'required|exists:kanban_lists,id',
            'position' => 'required|integer'
        ]);
        $card->update($data);
        return response()->json(['status' => 'success']);
    }

    public function updateDueDate(Request $request, $cardId)
    {
        $card = Card::findOrFail($cardId);
        $data = $request->validate([
            'due_date' => 'nullable|date'
        ]);
        $card->update($data);
        return response()->json(['status' => 'success', 'due_date' => $card->due_date]);
    }

    public function getTags()
    {
        return Tag::all();
    }

    public function getMembers()
    {
        return Member::all();
    }

    public function assignTag(Request $request, $cardId)
    {
        $card = Card::findOrFail($cardId);
        $card->tags()->syncWithoutDetaching([$request->tag_id]);
        return response()->json(['status' => 'success']);
    }

    public function assignMember(Request $request, $cardId)
    {
        $card = Card::findOrFail($cardId);
        $card->members()->syncWithoutDetaching([$request->member_id]);
        return response()->json(['status' => 'success']);
    }

    public function updateCard(Request $request, $cardId)
    {
        $card = Card::findOrFail($cardId);
        $data = $request->validate([
            'title'       => 'sometimes|required|string',
            'description' => 'nullable|string',
        ]);
        $card->update($data);
        return $card->load('tags', 'members');
    }

    public function deleteCard($cardId)
    {
        $card = Card::findOrFail($cardId);
        $card->delete();
        return response()->json(['status' => 'deleted']);
    }

    public function removeTag($cardId, $tagId)
    {
        $card = Card::findOrFail($cardId);
        $card->tags()->detach($tagId);
        return response()->json(['status' => 'removed']);
    }

    public function removeMember($cardId, $memberId)
    {
        $card = Card::findOrFail($cardId);
        $card->members()->detach($memberId);
        return response()->json(['status' => 'removed']);
    }

    public function seed()
    {
        if (Tag::count() === 0) {
            Tag::create(['name' => 'Bug', 'color' => '#ef4444']);
            Tag::create(['name' => 'Feature', 'color' => '#3b82f6']);
            Tag::create(['name' => 'Enhancement', 'color' => '#8b5cf6']);
            Tag::create(['name' => 'Urgent', 'color' => '#f97316']);
        }
        if (Member::count() === 0) {
            Member::create(['name' => 'Prashant', 'avatar' => 'https://ui-avatars.com/api/?name=Prashant&background=3b82f6&color=fff']);
            Member::create(['name' => 'Ayush', 'avatar' => 'https://ui-avatars.com/api/?name=Ayush&background=8b5cf6&color=fff']);
            Member::create(['name' => 'Rahul', 'avatar' => 'https://ui-avatars.com/api/?name=Rahul&background=ef4444&color=fff']);
        }
        return response()->json(['status' => 'seeded', 'tags' => Tag::all(), 'members' => Member::all()]);
    }
}
