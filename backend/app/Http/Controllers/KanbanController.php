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
        return Board::create($request->validate(['title' => 'required|string']));
    }

    public function createList(Request $request, $boardId)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'position' => 'integer'
        ]);
        $data['board_id'] = $boardId;
        return KanbanList::create($data);
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
        return $card->load('tags', 'members');
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
}
