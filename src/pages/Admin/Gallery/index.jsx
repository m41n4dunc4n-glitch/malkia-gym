import { useEffect, useState } from "react";

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

    loadImages();

    setUploading(false);

    alert("Image uploaded successfully.");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this image?")) return;

    await deleteGalleryImage(id);

    loadImages();
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold md:text-4xl">
          Gallery Management
        </h1>

        <p className="mt-2 text-gray-500">
          Upload images that instantly appear on the public website.
        </p>

      </div>

      {/* Upload Section */}

      <div className="rounded-3xl bg-white p-5 shadow-lg md:p-8">

        <div className="grid gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-semibold">
              Select Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full rounded-xl border p-4"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Caption
            </label>

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional caption..."
              className="w-full rounded-xl border p-4"
            />

          </div>

        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-8 w-full rounded-xl bg-pink-600 px-8 py-4 font-bold text-white transition hover:bg-pink-700 md:w-auto"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

      </div>

      {/* Empty State */}

      {images.length === 0 && (

        <div className="rounded-3xl bg-white p-12 text-center shadow">

          <h2 className="text-2xl font-bold">
            No Images Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Upload your first gallery image.
          </p>

        </div>

      )}

      {/* Gallery Grid */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {images.map((image) => (

          <div
            key={image.id}
            className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <img
              src={image.image_url}
              alt={image.caption}
              className="h-64 w-full object-cover"
            />

            <div className="p-5">

              <p className="min-h-12 text-gray-600">
                {image.caption || "No caption"}
              </p>

              <button
                onClick={() => handleDelete(image.id)}
                className="mt-5 w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Delete Image
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Gallery;