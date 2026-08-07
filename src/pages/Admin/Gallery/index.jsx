import { useEffect, useState } from "react";

import {
  FaCloudUploadAlt,
  FaImage,
  FaTrash,
  FaImages,
  FaCheckCircle,
} from "react-icons/fa";

import {
  uploadGalleryImage,
  addGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
} from "../../../services/gallery";

function Gallery() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data } = await getGalleryImages();

    setImages(data || []);
  }

  async function handleUpload() {
    if (!file) {
      alert("Please choose an image.");
      return;
    }

    setUploading(true);

    const upload = await uploadGalleryImage(file);

    if (upload.error) {
      alert(upload.error.message);
      setUploading(false);
      return;
    }

    const result = await addGalleryImage({
      image_url: upload.data,
      caption,
    });

    if (result.error) {
      alert(result.error.message);
      setUploading(false);
      return;
    }

    setCaption("");
    setFile(null);

    const fileInput = document.getElementById("gallery-file");

    if (fileInput) {
      fileInput.value = "";
    }

    await loadImages();

    setUploading(false);

    alert("Image uploaded successfully.");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this image?")) {
      return;
    }

    const result = await deleteGalleryImage(id);

    if (result?.error) {
      alert(result.error.message);
      return;
    }

    await loadImages();
  }

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-black via-zinc-900 to-pink-700 p-7 text-white shadow-xl md:p-10">

        {/* Decorative circles */}

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-pink-600/20 blur-3xl" />

        <div className="relative">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">

            <FaImages className="text-2xl text-pink-400" />

          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">
            Malkia Fitness
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            Gallery Management
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 md:text-base">
            Manage the images displayed across the public Malkia Fitness
            website. Upload new moments, update your gallery and keep the
            gym experience looking fresh.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <FaImages className="mr-2 inline text-pink-400" />
              {images.length}{" "}
              {images.length === 1 ? "Image" : "Images"}
            </div>

            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <FaCheckCircle className="mr-2 inline text-green-400" />
              Public Gallery
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          UPLOAD SECTION
      ===================================================== */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

        {/* Section heading */}

        <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-pink-50 px-6 py-6 md:px-8">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow">

              <FaCloudUploadAlt className="text-xl text-pink-400" />

            </div>

            <div>

              <h2 className="text-xl font-bold md:text-2xl">
                Add New Image
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload an image that will appear on the public gallery.
              </p>

            </div>

          </div>

        </div>


        {/* Upload body */}

        <div className="p-6 md:p-8">

          <div className="grid gap-6 lg:grid-cols-2">

            {/* File */}

            <div>

              <label
                htmlFor="gallery-file"
                className="mb-3 block text-sm font-bold text-gray-700"
              >
                Select Image
              </label>

              <label
                htmlFor="gallery-file"
                className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-pink-500 hover:bg-pink-50"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg transition group-hover:scale-105">

                  <FaCloudUploadAlt className="text-2xl text-pink-400" />

                </div>

                {file ? (

                  <>

                    <p className="mt-4 max-w-full break-all font-bold text-gray-800">
                      {file.name}
                    </p>

                    <p className="mt-1 text-sm text-green-600">
                      Image selected successfully
                    </p>

                  </>

                ) : (

                  <>

                    <p className="mt-4 font-bold text-gray-700">
                      Click to choose an image
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      PNG, JPG, JPEG or WEBP
                    </p>

                  </>

                )}

                <input
                  id="gallery-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                  className="hidden"
                />

              </label>

            </div>


            {/* Caption */}

            <div>

              <label
                htmlFor="gallery-caption"
                className="mb-3 block text-sm font-bold text-gray-700"
              >
                Caption
              </label>

              <textarea
                id="gallery-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write an optional caption for this image..."
                rows={7}
                className="w-full resize-none rounded-3xl border border-gray-200 bg-gray-50 p-5 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-100"
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                Optional
              </p>

            </div>

          </div>


          {/* Upload button */}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <FaImage className="text-pink-600" />

              {file
                ? "Ready to upload"
                : "Choose an image to continue"}

            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className={`rounded-2xl px-7 py-4 font-bold text-white shadow-lg transition ${
                uploading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-linear-to-r from-black to-pink-600 hover:-translate-y-0.5 hover:shadow-xl"
              }`}
            >

              <FaCloudUploadAlt className="mr-2 inline" />

              {uploading
                ? "Uploading..."
                : "Upload Image"}

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          GALLERY STATISTICS
      ===================================================== */}

      <div className="grid gap-5 sm:grid-cols-2">

        <div className="rounded-3xl bg-white p-6 shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Total Images
              </p>

              <h2 className="mt-2 text-4xl font-extrabold">
                {images.length}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Images currently stored in your gallery.
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100">

              <FaImages className="text-2xl text-pink-600" />

            </div>

          </div>

        </div>


        <div className="rounded-3xl bg-black p-6 text-white shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                Gallery Status
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">
                {images.length > 0
                  ? "Active"
                  : "Waiting for Images"}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                {images.length > 0
                  ? "Your public gallery has content."
                  : "Upload your first gallery image."}
              </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600">

              <FaCheckCircle className="text-2xl" />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {images.length === 0 && (

        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-lg md:p-16">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-pink-100">

            <FaImages className="text-3xl text-pink-600" />

          </div>

          <h2 className="mt-6 text-2xl font-bold">
            Your Gallery Is Empty
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-gray-500">
            Upload your first image above and it will appear here
            automatically.
          </p>

        </div>

      )}


      {/* =====================================================
          GALLERY GRID
      ===================================================== */}

      {images.length > 0 && (

        <div>

          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">
                Your Collection
              </p>

              <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">
                Gallery Images
              </h2>

            </div>

            <p className="text-sm text-gray-500">
              {images.length}{" "}
              {images.length === 1
                ? "image"
                : "images"}{" "}
              available
            </p>

          </div>


          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

            {images.map((image) => (

              <div
                key={image.id}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >

                {/* Image */}

                <div className="relative overflow-hidden bg-gray-100">

                  <img
                    src={image.image_url}
                    alt={image.caption || "Malkia Fitness gallery"}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  {/* Overlay */}

                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  {/* Image badge */}

                  <div className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">

                    <FaImage className="mr-1 inline text-pink-400" />

                    Gallery

                  </div>

                </div>


                {/* Details */}

                <div className="p-5">

                  <div className="min-h-14">

                    <p className="font-medium leading-6 text-gray-700">
                      {image.caption || "No caption added"}
                    </p>

                  </div>


                  <div className="mt-5 border-t border-gray-100 pt-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(image.id)
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >

                      <FaTrash />

                      Delete Image

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default Gallery;