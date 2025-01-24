import {useState, useEffect} from 'react';
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
  ])

  // Set a random background on component mount
  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBackgroundImage(randomImage);
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <>
    <div
     className="main-container"
     style={{
       backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`
    }}
    >
      <Searchb />
    </div>
      <About />
    </>
  );
};

export default Main;
