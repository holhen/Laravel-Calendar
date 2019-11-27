<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable=["title", "start", "end", "allDay", "user_id"];
}
