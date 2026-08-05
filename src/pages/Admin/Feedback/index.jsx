import { useEffect, useState } from "react";
import { getFeedback } from "../../../services/feedback";
import { supabase } from "../../../services/supabase";

function Feedback() {

    const [feedback,setFeedback]=useState([]);

    const loadFeedback = async () => {

        const {data}=await getFeedback();

        setFeedback(data||[]);

    };

    useEffect(()=>{

        let isMounted = true;

        const fetchFeedback = async () => {

            const {data}=await getFeedback();

            if (isMounted) {

                setFeedback(data||[]);

            }

        };

        fetchFeedback();

        return () => {

            isMounted = false;

        };

    },[]);

    async function deleteFeedback(id){

        const confirmDelete=window.confirm("Delete this feedback?");

        if(!confirmDelete) return;

        await supabase
        .from("feedback")
        .delete()
        .eq("id",id);

        loadFeedback();

    }

    return(

        <div>

            <h1 className="text-4xl font-bold">
                Member Feedback
            </h1>

            <p className="mt-2 text-gray-500">
                View what members are saying.
            </p>

            <div className="mt-10 space-y-6">

            {feedback.map(item=>(

                <div
                key={item.id}
                className="rounded-3xl bg-white p-6 shadow">

                    <div className="flex justify-between">

                        <div>

                            <h2 className="text-xl font-bold">

                                {"⭐".repeat(item.rating)}

                            </h2>

                            <p className="mt-2 font-semibold">

                                {item.profiles?.full_name}

                            </p>

                            <p className="text-sm text-gray-500">

                                {item.profiles?.email}

                            </p>

                        </div>

                        <button

                        onClick={()=>deleteFeedback(item.id)}

                        className="rounded-lg bg-red-600 px-4 py-2 text-white"

                        >

                            Delete

                        </button>

                    </div>

                    <h3 className="mt-6 text-lg font-bold">

                        {item.subject}

                    </h3>

                    <p className="mt-2 text-gray-600">

                        {item.message}

                    </p>

                </div>

            ))}

            </div>

        </div>

    );

}

export default Feedback;