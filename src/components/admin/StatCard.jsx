const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-center items-center">
    <h3 className="text-gray-600">{title}</h3>
    <h2 className="text-2xl font-bold text-blue-600 mt-1">{value}</h2>
  </div>
);
export default StatCard;
