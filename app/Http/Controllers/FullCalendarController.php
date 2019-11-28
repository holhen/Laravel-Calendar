<?php

namespace App\Http\Controllers;

use App\Event;
use Illuminate\Http\Request;
use Response;

class FullCalendarController extends Controller
{

    public function index($user_id)
    {
        if(!empty($_GET["start"]) && !empty($_GET["end"])) {
            $start = $_GET["start"];
            $end = $_GET["end"];
            $data = Event::whereDate('start', '>=', $start)->whereDate('end',   '<=', $end)->where('user_id', $user_id)->get(['id','title','start', 'end', 'allDay']);
            return Response::json($data);
        }

        return view("fullcalendar");
    }


    public function create(Request $request, $user_id)
    {
        $insertArr = [ 'title' => $request->title,
                       'start' => $request->start,
                       'end' => $request->end,
                       'allDay' => $request->allDay,
                       'user_id' => $user_id
                    ];
        $event = Event::create($insertArr);
        return Response::json($event);
    }


    public function update(Request $request)
    {
        $where = array('id' => $request->id);
        $updateArr = ['title' => $request->title,'start' => $request->start, 'end' => $request->end, 'allDay' => $request->allDay];
        $event  = Event::where($where)->update($updateArr);

        return Response::json($event);
    }


    public function destroy(Request $request)
    {
        $event = Event::where('id',$request->id)->delete();

        return Response::json($event);
    }


}
