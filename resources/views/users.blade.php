@extends('layouts.app')

@section("content")
    Users currently in the database:
    <table>
        <thead>
            <tr>
                <th>Username</th>
                <th>E-mail</th>
                <th>Group name</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($users as $user)
                <tr>
                    <td><a href="/users/{{ $user->id }}">{{ $user->name }}</a></td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->team->name }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
