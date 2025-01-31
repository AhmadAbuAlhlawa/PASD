import React from 'react'
import './css/About_us.css'
const AboutUs = () => {
  const team = [
    { name: 'Dr. Yara Saifi', image: 'Dr. Yara Saifi.jpg' },
    { name: 'Aya Jafreh', image: 'Aya Jafreh.jpg' },
    { name: 'Aya shream', image: 'Aya shream.jpg' },
    
    { name: 'Ayham Mallh', image: 'Ayham Mallh.jpeg' },
    { name: 'Ayham hamad', image: 'Ayham naeem hamad.jpg' },
    { name: 'Balsam al-Salamah', image: 'Balsam Khader al- Salamah.jpg' },
    { name: 'Dima mousa', image: 'Dima mousa.jpg' },
    { name: 'Ayman Njoom', image: 'Ayman Njoom.jpg' },
    { name: 'Dunia Najajra', image: 'Dunia Najajra.jpeg' },
    { name: 'Huthaifa Mousa', image: 'Huthaifa Jafar Mahmoud Mousa.jpg' },
    { name: 'Lugain Malek', image: 'Lugain Malek.jfif' },
    
    { name: 'Ameera Maharbah', image: 'Ameera Maharbah.jpg' },
    { name: 'Dana Abuayyash', image: 'Dana Abuayyash.jpg' },
    { name: 'Moddar Khatib', image: 'Moddar Khatib.jpg' },
    
    { name: 'Narmeen Attallah', image: 'Narmeen Attallah.jpg' },
    { name: 'Omar hussein', image: 'Omar hussein.jpg' },
    { name: 'Razan AbuRayyan', image: 'Razan AbuRayyan.jpeg' },

    { name: 'Safaa Alajarmah', image: 'Safaa Alajarmah.jpg' },
    { name: 'Sandy Jaafreh', image: 'Sandy Fareed Jaafreh.jpg' },
    { name: 'Yazed rabhh', image: 'YAZED MOHAMED ABED RABHH.jpg' },
    { name: 'Yqoub halabea', image: 'Yqoub halabea.jpg' },
  ];
  const software_team = [
    { name: 'Masa Aljayyousi', image: 'Masa Aljayyousi.jpg' },
    { name: 'Ahmad Abu Al-Hlawa', image: 'Ahmad Abu Al-Hlawa.png' },
    { name: 'Alaa Abdalqader', image: 'Alaa Abdalqader.jpg' },
    { name: 'Huthayfa Shaheen', image: 'Huthayfa Shaheen.jpg' },
  ]

  return (
    <div className='about_us'>
      <div className="about_us_container">
        <div className='team'>
          <h2 className='text-center'>Meet Our Team</h2>
          <div className='team_members'>
            {team.map((member, index) => (
              <div key={index} className='team_member'>
                <div className='w-100'><img loading='lazy' src={`/imge/team_images/${member.image}`} alt={member.name} className='team_image' /></div>
                <p className='team_name'>{member.name}</p>
              </div>
            ))}
          </div>
          <div className='software_team'>
            <h2>Software Developer</h2>
            <div className='team_members'>
              {software_team.map((member, index) => (
                <div key={index} className='team_member'>
                  <div className='w-100'><img loading='lazy' src={`/imge/team_images/${member.image}`} alt={member.name} className='team_image' /></div>
                  <p className='team_name'>{member.name}</p>
                </div>
              ))}
              </div>
          </div>
        </div>
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