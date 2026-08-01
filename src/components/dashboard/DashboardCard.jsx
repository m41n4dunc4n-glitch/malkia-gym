function DashboardCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 lg:p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <p className="text-xs sm:text-sm uppercase tracking-wider text-gray-500">
        {title}
      </p>

      <h2 className="mt-4 wrap-break-word text-xl sm:text-2xl lg:text-3xl font-bold text-pink-600">
        {value}
      </h2>

    </div>
  );
}

export default DashboardCard;