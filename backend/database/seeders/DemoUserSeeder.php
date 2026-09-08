<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('Demo@12345');

        foreach ([
            ['admin', 'BSH Administrator', 'admin'],
            ['approver', 'BSH Approver', 'approver'],
            ['evaluator', 'BSH Evaluator', 'evaluator'],
            ['management', 'BSH Management', 'management_viewer'],
            ['vendor', 'MediSupply Ltd.', 'vendor'],
        ] as [$account, $name, $role]) {
            User::updateOrCreate(
                ['email' => $account.'@bsh-demo.com'],
                ['name' => $name, 'role' => $role, 'password' => $password],
            );
        }
    }
}
