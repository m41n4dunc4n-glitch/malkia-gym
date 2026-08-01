import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaImages,
  FaPlayCircle,
} from "react-icons/fa";

import { getGalleryImages } from "../../services/gallery";

function Gallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadGallery() {
      const { data } = await getGalleryImages();
      if (isMounted) {
        setPhotos(data || []);
      }
    }

    loadGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* Hero */}

      {/* Hero */}

<section className="mt-20 bg-black text-white">

  <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-24 lg:py-28 text-center">

    <p className="uppercase tracking-[4px] sm:tracking-[6px] font-semibold text-pink-500">

      GALLERY

    </p>

    <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">

      Experience

      <br />

      Malkia Fitness

    </h1>

    <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-gray-300 leading-8">

      Every image tells a story of dedication, strength and transformation.

    </p>

  </div>

</section>

      {/* Intro */}

      {/* Intro */}

<section className="bg-white py-16 sm:py-20">

  <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center">

    <h2 className="text-4xl sm:text-5xl font-bold leading-tight">

      Every Workout

      <br />

      Tells A Story

    </h2>

    <p className="mt-6 max-w-4xl mx-auto text-base sm:text-lg text-gray-600 leading-8">

      From beginner victories to championship moments,
      every member contributes to the Malkia Fitness story.

    </p>

  </div>

</section>

      {/* Stats */}

      {/* Stats */}

<section className="bg-pink-600 py-16 sm:py-20 text-white">

  <div className="max-w-7xl mx-auto px-6 sm:px-8">

    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 text-center">

      <div>

        <FaImages
          size={50}
          className="mx-auto mb-5"
        />

        <h2 className="text-4xl sm:text-5xl font-bold">

          {photos.length}

        </h2>

        <p className="mt-3 text-lg">
          Photos
        </p>

      </div>

      <div>

        <FaPlayCircle
          size={50}
          className="mx-auto mb-5"
        />

        <h2 className="text-4xl sm:text-5xl font-bold">

          Coming Soon

        </h2>

        <p className="mt-3 text-lg">
          Videos
        </p>

      </div>

      <div>

        <FaImages
          size={50}
          className="mx-auto mb-5"
        />

        <h2 className="text-4xl sm:text-5xl font-bold">

          Unlimited

        </h2>

        <p className="mt-3 text-lg">
          Memories
        </p>

      </div>

    </div>

  </div>

</section>

      {/* Gallery */}

      {/* Gallery */}

<section className="bg-gray-100 py-16 sm:py-20 lg:py-24">

  <div className="max-w-7xl mx-auto px-6 sm:px-8">

    {photos.length === 0 ? (

      <div className="py-20 text-center">

        <h2 className="text-2xl sm:text-3xl font-bold">

          No Gallery Images Yet

        </h2>

        <p className="mt-4 text-gray-500">

          Images uploaded by the administrator
          will appear here automatically.

        </p>

      </div>

    ) : (

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {photos.map((photo) => (

          <div
            key={photo.id}
            className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            <div className="aspect-square overflow-hidden">

              <img
                src={photo.image_url}
                alt={photo.caption}
                className="h-full w-full object-cover transition duration-500 hover:scale-110"
              />

            </div>

            {photo.caption && (

              <div className="p-5">

                <p className="text-center text-gray-700">

                  {photo.caption}

                </p>

              </div>

            )}

          </div>

        ))}

      </div>

    )}

  </div>

</section>

      {/* CTA */}

     {/* CTA */}

<section className="bg-pink-600 py-16 sm:py-20 lg:py-24 text-white">

  <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">

    <h2 className="text-4xl sm:text-5xl font-bold leading-tight">

      Ready To Join

      <br />

      Our Community?

    </h2>

    <p className="mt-6 text-lg sm:text-xl">

      Start your fitness journey today.

    </p>

    <Link
      to="/register"
      className="inline-flex items-center gap-3 mt-10 rounded-xl bg-black px-8 py-4 font-semibold transition hover:bg-zinc-900"
    >

      Join Today

      <FaArrowRight />

    </Link>

  </div>

</section>

    </>
  );
}

export default Gallery;