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
    <section className="py-24 border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-8 text-center">

          {stats.map((stat) => (
            <div key={stat.label}>
              <h3 className="text-5xl font-bold text-[#D4AF37]">
                {stat.value}
              </h3>

              <p className="text-zinc-400 mt-3">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}