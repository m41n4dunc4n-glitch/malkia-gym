import { useEffect } from "react";
import { supabase } from "../../services/supabase";

function Test() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.auth.getSession();

      console.log("Supabase Connected");
      console.log(data);

      if (error) {
        console.error(error);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="mt-20 flex min-h-screen items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">
        Testing Supabase Connection...
      </h1>
    </div>
  );
}

export default Test;