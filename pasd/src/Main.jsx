import { useState, useEffect } from 'react';
import './css/Main.css';
import Searchb from './components/Searchb';
import About from './components/About';

const Main = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  const [images, setImages] = useState([
    'http://localhost:3000/imge/img_1.jpg',
    'http://localhost:3000/imge/img_2.JPG',
    'http://localhost:3000/imge/img_3.JPG',
    'http://localhost:3000/imge/img_4.jpg',
    'http://localhost:3000/imge/img_5.jpg',
    'http://localhost:3000/imge/img_6.jpg',
  ]);

  // Change background image every 10 seconds
  useEffect(() => {
    const updateBackgroundImage = () => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setBackgroundImage(randomImage);
    };

    // Set an initial background image
    updateBackgroundImage();

    // Set up interval for updating the background image
    const intervalId = setInterval(updateBackgroundImage, 15000); // 15 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <>
      <div
        className="main-container"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url(${backgroundImage})`,
        }}
      >
        <Searchb />
      </div>
      <About />
    </>
  );
};

export default Main;
