export default function Stats() {
  const stats = [
    {
      value: "15+",
      label: "Years Experience",
    },
    {
      value: "20K+",
      label: "Orders Completed",
    },
    {
      value: "50+",
      label: "Countries Served",
    },
    {
      value: "98%",
      label: "Client Satisfaction",
    },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">

          {stats.map((stat) => (
            <div key={stat.label}>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#D4AF37]">
                {stat.value}
              </h3>

              <p className="text-zinc-400 mt-2 sm:mt-3 text-sm sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
