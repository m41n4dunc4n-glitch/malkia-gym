import { Outlet } from "react-router-dom";
import TrainerSidebar from "../components/trainer/TrainerSidebar";
import TrainerHeader from "../components/trainer/TrainerHeader";

function TrainerLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TrainerSidebar />

      <div className="lg:pl-72">
        <TrainerHeader />

        <main className="min-h-[calc(100vh-80px)] p-4 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default TrainerLayout;