function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="mt-4 text-5xl font-bold text-pink-600">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;