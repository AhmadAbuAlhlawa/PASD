import { useState, useEffect } from "react";
import "./css/Main.css";
import Searchb from "./components/Searchb";
import About_PASD from "./components/About_PASD";

const Main = () => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [fade, setFade] = useState(false);
  const [lastImageIndex, setLastImageIndex] = useState(null);

  const images = [
    { url: "http://localhost:3000/imge/img_1.jpg", desc: "Ancient architectural masterpiece in Palestine." },
    { url: "http://localhost:3000/imge/img_2.JPG", desc: "A historic street capturing the essence of the city." },
    { url: "http://localhost:3000/imge/img_3.JPG", desc: "A stunning view of the city skyline at sunset." },
    { url: "http://localhost:3000/imge/img_4.jpg", desc: "Old stone buildings with traditional craftsmanship." },
    { url: "http://localhost:3000/imge/img_5.jpg", desc: "The vibrant colors of Palestinian heritage." },
    { url: "http://localhost:3000/imge/img_6.jpg", desc: "A historic mosque with intricate architecture." },
    { url: "http://localhost:3000/imge/img_7.jpg", desc: "An ancient market bustling with culture and life." },
    { url: "http://localhost:3000/imge/img_8.jpg", desc: "A peaceful village nestled in the hills of Palestine." },
    { url: "http://localhost:3000/imge/img_9.jpg", desc: "A breathtaking view of an old town square." },
  ];

  useEffect(() => {
    const updateBackground = () => {
      setFade(true); // Trigger fade effect
      setTimeout(() => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * images.length);
        } while (newIndex === lastImageIndex);
        
        setBackgroundImage(images[newIndex].url);
        setImageDescription(images[newIndex].desc);
        setLastImageIndex(newIndex);
        setFade(false); // Remove fade after change
      }, 500); // Duration of fade-out before changing the image
    };

    updateBackground(); // Set initial image
    const intervalId = setInterval(updateBackground, 7000); // Change image every 7 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div
        className={`main-container ${fade ? "fade" : ""}`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        data-description={imageDescription} // Pass the description as a data attribute
      >
        <Searchb />
        
        <div className="description-box">
          <p>{imageDescription}</p>
        </div>
      </div>
      <About_PASD />
    </>
  );
};

export default Main;
