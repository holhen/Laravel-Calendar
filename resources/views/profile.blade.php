@extends('layouts.app')

@section('content')
    <ul>
        <li>Name: {{ $user->name }}</li>
        <li>Email: {{ $user->email }}</li>
        <li>Image: TODO</li>
        <li>Group Name: {{ $user->team->name}}</li>
        <li>Group Image: TODO</li>
        <li>Occupation: TODO</li>
        <li>Address: TODO</li>
        <li>Place of Birth: TODO</li>
        <li>Date of Birth: TODO</li>
    </ul>
    <p>See this user's <a href="/fullcalendar/{{ $user->id }}">calendar</a></p>
@endsection
