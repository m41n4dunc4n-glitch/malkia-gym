import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGalleryImages } from "../../services/gallery";

function GalleryPreview() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadImages() {
      const { data } = await getGalleryImages();

      if (mounted) {
        setImages(data || []);
      }
    }

    loadImages();

    return () => {
      mounted = false;
    };
  }, []);

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
            Take a glimpse into the Malkia experience—from intense workouts to
            inspiring transformations and a supportive community.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {images.slice(0, 3).map((image) => (

            <div
              key={image.id}
              className="group overflow-hidden rounded-3xl shadow-lg"
            >

              <img
                src={image.image_url}
                alt={image.caption || "Gallery Image"}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-72"
              />

            </div>

          ))}

        </div>

        {images.length === 0 && (

          <div className="py-16 text-center text-gray-500">
            No gallery images available.
          </div>

        )}

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