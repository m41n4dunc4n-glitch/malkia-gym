import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

function ScrollTop() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {

    const toggle = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggle);

    return () => window.removeEventListener("scroll", toggle);

  }, []);

  const scrollTop = () => {

    window.scrollTo({

      top: 0,
      behavior: "smooth",

    });

  };

  return (

    visible && (

      <button
        onClick={scrollTop}
        className="fixed bottom-8 right-8 z-50 rounded-full bg-pink-600 p-4 text-white shadow-xl transition hover:bg-pink-700"
      >
        <FaArrowUp />
      </button>

    )

  );

}

export default ScrollTop;