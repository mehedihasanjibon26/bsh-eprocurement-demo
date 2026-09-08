<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DemoUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_users_are_rerunnable_and_can_authenticate(): void
    {
        $this->seed(DemoUserSeeder::class);
        $this->seed(DemoUserSeeder::class);
        $this->assertDatabaseCount('users', 5);

        foreach (['admin' => 'admin', 'approver' => 'approver', 'evaluator' => 'evaluator', 'management' => 'management_viewer', 'vendor' => 'vendor'] as $account => $role) {
            $email = $account.'@bsh-demo.com';
            $this->assertTrue(Hash::check('Demo@12345', User::where('email', $email)->first()->password));

            $login = $this->postJson('/api/auth/login', ['email' => $email, 'password' => 'Demo@12345'])
                ->assertOk()
                ->assertJsonPath('user.role', $role)
                ->assertJsonPath('token_type', 'Bearer')
                ->assertJsonMissingPath('user.password')
                ->assertJsonMissingPath('user.remember_token');

            $token = $login->json('token');
            $this->app['auth']->forgetGuards();
            $this->withToken($token)->getJson('/api/auth/me')->assertOk()->assertJsonPath('user.email', $email);
            $this->app['auth']->forgetGuards();
            $this->withToken($token)->postJson('/api/auth/logout')->assertNoContent();
            $this->app['auth']->forgetGuards();
            $this->withToken($token)->getJson('/api/auth/me')->assertUnauthorized();
        }

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_invalid_credentials_and_validation_return_clean_errors(): void
    {
        $this->seed(DemoUserSeeder::class);
        $this->postJson('/api/auth/login', [])->assertUnprocessable()->assertJsonValidationErrors(['email', 'password']);
        $this->postJson('/api/auth/login', ['email' => 'invalid', 'password' => 'x'])->assertUnprocessable();

        foreach (['admin@bsh-demo.com', 'missing@bsh-demo.com'] as $email) {
            $this->postJson('/api/auth/login', ['email' => $email, 'password' => 'wrong'])
                ->assertUnauthorized()->assertJsonPath('message', 'The email or password is incorrect.');
        }
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_protected_endpoints_reject_missing_and_invalid_tokens(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
        $this->postJson('/api/auth/logout')->assertUnauthorized();
        $this->withToken('invalid-token')->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_logout_revokes_only_the_current_session(): void
    {
        $this->seed(DemoUserSeeder::class);
        $user = User::where('email', 'admin@bsh-demo.com')->first();
        $first = $user->createToken('first')->plainTextToken;
        $second = $user->createToken('second')->plainTextToken;

        $this->withToken($first)->postJson('/api/auth/logout')->assertNoContent();
        $this->app['auth']->forgetGuards();
        $this->withToken($second)->getJson('/api/auth/me')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }
}
