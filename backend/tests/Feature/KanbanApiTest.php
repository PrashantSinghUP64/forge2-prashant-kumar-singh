<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Board;
use App\Models\KanbanList;
use App\Models\Card;
use App\Models\Tag;
use App\Models\Member;

class KanbanApiTest extends TestCase
{
    use RefreshDatabase;

    // ─────────────────────────────────────────────
    // BOARDS
    // ─────────────────────────────────────────────

    public function test_can_list_boards(): void
    {
        Board::create(['title' => 'Test Board']);

        $response = $this->getJson('/api/boards');

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment(['title' => 'Test Board']);
    }

    public function test_can_create_board(): void
    {
        $response = $this->postJson('/api/boards', ['title' => 'Sprint Board']);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'Sprint Board']);

        $this->assertDatabaseHas('boards', ['title' => 'Sprint Board']);
    }

    public function test_create_board_requires_title(): void
    {
        $response = $this->postJson('/api/boards', []);

        $response->assertStatus(422);
    }

    public function test_can_get_single_board_with_lists_and_cards(): void
    {
        $board = Board::create(['title' => 'My Board']);
        $list  = KanbanList::create(['title' => 'To Do', 'position' => 0, 'board_id' => $board->id]);
        Card::create(['title' => 'Task A', 'position' => 0, 'kanban_list_id' => $list->id]);

        $response = $this->getJson("/api/boards/{$board->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['title' => 'My Board'])
                 ->assertJsonFragment(['title' => 'To Do'])
                 ->assertJsonFragment(['title' => 'Task A']);
    }

    // ─────────────────────────────────────────────
    // LISTS
    // ─────────────────────────────────────────────

    public function test_can_create_list_on_board(): void
    {
        $board = Board::create(['title' => 'Board X']);

        $response = $this->postJson("/api/boards/{$board->id}/lists", [
            'title'    => 'In Progress',
            'position' => 1,
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'In Progress']);

        $this->assertDatabaseHas('kanban_lists', ['title' => 'In Progress', 'board_id' => $board->id]);
    }

    // ─────────────────────────────────────────────
    // CARDS
    // ─────────────────────────────────────────────

    public function test_can_create_card_in_list(): void
    {
        $board = Board::create(['title' => 'Board']);
        $list  = KanbanList::create(['title' => 'Backlog', 'position' => 0, 'board_id' => $board->id]);

        $response = $this->postJson("/api/lists/{$list->id}/cards", [
            'title'    => 'New Card',
            'position' => 0,
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'New Card']);

        $this->assertDatabaseHas('cards', ['title' => 'New Card', 'kanban_list_id' => $list->id]);
    }

    public function test_can_move_card_to_another_list(): void
    {
        $board  = Board::create(['title' => 'B']);
        $list1  = KanbanList::create(['title' => 'L1', 'position' => 0, 'board_id' => $board->id]);
        $list2  = KanbanList::create(['title' => 'L2', 'position' => 1, 'board_id' => $board->id]);
        $card   = Card::create(['title' => 'C', 'position' => 0, 'kanban_list_id' => $list1->id]);

        $response = $this->patchJson("/api/cards/{$card->id}/move", [
            'kanban_list_id' => $list2->id,
            'position'       => 0,
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'success']);

        $this->assertDatabaseHas('cards', ['id' => $card->id, 'kanban_list_id' => $list2->id]);
    }

    public function test_can_update_due_date(): void
    {
        $board = Board::create(['title' => 'B']);
        $list  = KanbanList::create(['title' => 'L', 'position' => 0, 'board_id' => $board->id]);
        $card  = Card::create(['title' => 'C', 'position' => 0, 'kanban_list_id' => $list->id]);

        $response = $this->patchJson("/api/cards/{$card->id}/due-date", [
            'due_date' => '2025-12-31',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'success']);

        $this->assertDatabaseHas('cards', ['id' => $card->id]);
    }

    // ─────────────────────────────────────────────
    // TAGS & MEMBERS
    // ─────────────────────────────────────────────

    public function test_can_list_tags(): void
    {
        Tag::create(['name' => 'Bug', 'color' => '#ef4444']);

        $response = $this->getJson('/api/tags');

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Bug']);
    }

    public function test_can_list_members(): void
    {
        Member::create(['name' => 'Prashant', 'avatar' => 'https://example.com/a.png']);

        $response = $this->getJson('/api/members');

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Prashant']);
    }

    public function test_can_assign_tag_to_card(): void
    {
        $board = Board::create(['title' => 'B']);
        $list  = KanbanList::create(['title' => 'L', 'position' => 0, 'board_id' => $board->id]);
        $card  = Card::create(['title' => 'C', 'position' => 0, 'kanban_list_id' => $list->id]);
        $tag   = Tag::create(['name' => 'Feature', 'color' => '#3b82f6']);

        $response = $this->postJson("/api/cards/{$card->id}/tags", ['tag_id' => $tag->id]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'success']);

        $this->assertDatabaseHas('card_tag', ['card_id' => $card->id, 'tag_id' => $tag->id]);
    }

    public function test_can_assign_member_to_card(): void
    {
        $board  = Board::create(['title' => 'B']);
        $list   = KanbanList::create(['title' => 'L', 'position' => 0, 'board_id' => $board->id]);
        $card   = Card::create(['title' => 'C', 'position' => 0, 'kanban_list_id' => $list->id]);
        $member = Member::create(['name' => 'Ayush', 'avatar' => 'https://example.com/a.png']);

        $response = $this->postJson("/api/cards/{$card->id}/members", ['member_id' => $member->id]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'success']);

        $this->assertDatabaseHas('card_member', ['card_id' => $card->id, 'member_id' => $member->id]);
    }

    // ─────────────────────────────────────────────
    // HEALTH CHECK
    // ─────────────────────────────────────────────

    public function test_health_endpoint(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
                 ->assertJsonFragment(['status' => 'ok']);
    }
}
