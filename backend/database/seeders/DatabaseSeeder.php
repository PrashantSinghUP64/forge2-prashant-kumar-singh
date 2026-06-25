<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\KanbanList;
use App\Models\Card;
use App\Models\Tag;
use App\Models\Member;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $board = Board::create(['title' => 'Forge 2 Sprint']);

        $todo = KanbanList::create(['board_id' => $board->id, 'title' => 'To Do', 'position' => 0]);
        $inProgress = KanbanList::create(['board_id' => $board->id, 'title' => 'In Progress', 'position' => 1]);
        $done = KanbanList::create(['board_id' => $board->id, 'title' => 'Done', 'position' => 2]);

        $tagBug = Tag::create(['name' => 'Bug', 'color' => '#ef4444']);
        $tagFeature = Tag::create(['name' => 'Feature', 'color' => '#3b82f6']);

        $member1 = Member::create(['name' => 'Prashant', 'avatar' => 'https://ui-avatars.com/api/?name=Prashant&background=3b82f6&color=fff']);
        $member2 = Member::create(['name' => 'Ayush', 'avatar' => 'https://ui-avatars.com/api/?name=Ayush&background=8b5cf6&color=fff']);

        $card1 = Card::create([
            'kanban_list_id' => $todo->id,
            'title' => 'Setup OpenClaw',
            'description' => 'Install and configure OpenClaw with Slack',
            'due_date' => now()->addDays(2),
            'position' => 0
        ]);
        $card1->tags()->attach($tagFeature);
        $card1->members()->attach($member1);

        $card2 = Card::create([
            'kanban_list_id' => $inProgress->id,
            'title' => 'Fix Hermes Memory',
            'description' => 'Memory is not persisting across sessions',
            'due_date' => now()->subDays(1),
            'position' => 0
        ]);
        $card2->tags()->attach($tagBug);
        $card2->members()->attach($member2);

        $card3 = Card::create([
            'kanban_list_id' => $done->id,
            'title' => 'Register for Forge 2',
            'description' => 'Fill out the form and submit Github profile',
            'due_date' => now()->subDays(5),
            'position' => 0
        ]);
    }
}
