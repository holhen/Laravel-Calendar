<?php

namespace App\Http\Controllers;

use App\Event;
use Illuminate\Http\Request;
use Response;

class FullCalendarController extends Controller
{
    /*
        @param Illuminate\Http\Request $request
        @return Response
    */
    public function index(Request $request, $user_id)
    {
        $data = Event::where('user_id', $user_id)->get(['id','title','start', 'end', 'allDay']);
        return Response::json($data);
    }


    public function create(Request $request, $user_id=null)
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
