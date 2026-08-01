import { Link } from "react-router-dom";

function GalleryPreview() {

  const images = [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800",
    "https://images.unsplash.com/photo-1549570652-97324981a6fd?w=800",
    "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800",
  ];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">

      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        <div className="mb-14 text-center">

          <p className="text-sm font-semibold uppercase tracking-[4px] text-pink-500 sm:text-base">
            GALLERY
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Strength In Every Moment
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
            Take a glimpse into the Malkia experience—from intense workouts to inspiring transformations and a supportive community.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {images.map((image, index) => (

            <div
              key={index}
              className="group overflow-hidden rounded-3xl shadow-lg"
            >

              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-72"
              />

            </div>

          ))}

        </div>

        <div className="mt-14 text-center">

          <Link
            to="/gallery"
            className="inline-block rounded-xl bg-pink-600 px-8 py-4 font-semibold text-white transition hover:bg-pink-700"
          >
            View Full Gallery
          </Link>

        </div>

      </div>

    </section>
  );
}

export default GalleryPreview;