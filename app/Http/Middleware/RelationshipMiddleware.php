<?php

namespace App\Http\Middleware;

use Closure;
use App\User;

class RelationshipMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
            $user= User::where('id', $request->route("user_id"))->first();
            abort_if(($user->team->name != $request->user()->team->name),403,"Unauthorized: Not in common groups");
            return $next($request);
    }
}
