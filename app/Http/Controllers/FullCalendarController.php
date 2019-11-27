<?php

namespace App\Http\Controllers;

use App\Event;
use Illuminate\Http\Request;
use Redirect,Response;
use Illuminate\Support\Facades\Auth;

class FullCalendarController extends Controller
{

    public function index()
    {
        $start = (!empty($_GET["start"])) ? ($_GET["start"]) : ('');
        $end = (!empty($_GET["end"])) ? ($_GET["end"]) : ('');
        $data = Event::whereDate('start', '>=', $start)->whereDate('end',   '<=', $end)->where('user_id', Auth::id())->get(['id','title','start', 'end', 'allDay']);
        return Response::json($data);
    }


    public function create(Request $request)
    {
        $insertArr = [ 'title' => $request->title,
                       'start' => $request->start,
                       'end' => $request->end,
                       'allDay' => $request->allDay,
                       'user_id' => Auth::id()
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
