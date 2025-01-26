import React from 'react'
import "../css/About.css";  

export const About = () => {
  return (
<div id='about_pasd' className="about-container">
    <div className="about">
      <div>
        <h2>About PASD</h2>  
        <h3>The Palestinian Archive Society for Documentation (PASD) is a student and researcher-led initiativeat Al-Quds University dedicated to preserving and documenting Palestine's rich history, culture, and heritage, as well as that of its diaspora. Recognizing the critical need to preserve the stories and memories that define our past. PASD works progressively to create a comprehensive and collective archive that embodies the Palestinian resilience.
        <br></br><br></br>This endeavor is built upon our resources that capture the essence of the Palestinian legacy being organized, preserved and gathered during each academic semester. PASD represents a historical record and a living resource, connecting past experiences with future aspirations.
        <br></br><br></br>PASD is made possible by the collaboration of students and faculty from the Architectural and Computer Engineering departments, who share their knowledge in archival preservation, digital technology, and design. Together, we are dedicated to developing a dynamic archive that will preserve Palestinian history for present and future generations.
        <br></br><br></br>Join us in this continuous effort to document, safeguard, and share stories about Palestine's legacy as part of a greater purpose of resilience and cultural preservation.</h3>
      </div>
        <img className='about_image' src='imge/sketch.png'></img>
    </div>    
</div>
  
  )
}
export default About ;
