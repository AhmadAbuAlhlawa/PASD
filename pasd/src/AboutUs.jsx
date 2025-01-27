import React from 'react'
import './css/About_us.css'
const AboutUs = () => {
  return (
    <div className='about_us'>
        <div className="about_us_container">
            <img src={'http://localhost:3000/imge/about_us_img.jpg'} alt="about_us image" />
            <div className='data'>
                <h2>Who We Are?</h2>
                <p>
                The Palestinian Archive Society for Documentation (PASD) is a project led by academics and students at Al-Quds University, committed to preserving and commemorating Palestine's rich cultural heritage, history, and diaspora experiences.
                <br />
                <br />
                With the support and collaboration of students and faculty from the Architectural and Computer Engineering departments at Al-Quds University, we work to create a comprehensive archive that captures the essence of Palestinian resilience. 
                <br />
                <br />
                At PASD, we are dedicated to ensuring that the history and cultural legacy of Palestine are preserved and accessible for future generations, fostering a shared commitment to resilience and cultural preservation.
                </p>
            </div>
        </div>
    </div>
  )
}

export default AboutUs