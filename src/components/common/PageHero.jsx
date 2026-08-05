function PageHero({
  label,
  title,
  subtitle,
  image,
}) {
  return (
    <section
      className="relative mt-20 flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65"></div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base lg:tracking-[6px]">
            {label}
          </p>

          <h1 className="mt-6 whitespace-pre-line text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-300 lg:text-xl">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>

      </div>
    </section>
  );
}

export default PageHero;