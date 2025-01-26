import React from 'react'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import '../css/footer.css';

const Footer = () => {
  return (
    <div className='footer_container'>
        <div className="wrapper">
            <div className="footer_row">
                <a href='/' className='logo'><img src="https://www.alquds.edu/wp-content/uploads/2022/02/black-logo.png" alt="AQU LOGO" /></a>
                <div>
                    <h5>Address</h5>
                    <p className='mb-0'>University of Al-Quds</p>
                    <p className='mb-0'>Palestine, Jerusalem</p>
                </div>
                <div>
                    <h5>Contact</h5>
                    <p className='mb-0'>Phone: (+970) 2 2790606</p>
                    <p className='mb-0'>Email: pr@alquds.edu</p>
                </div>
            </div>
            <hr />
            <div className='footer_bottom'>
                <div>
                    <p>© {new Date().getFullYear()} All copyrights reserved for Al-Quds University.</p>
                    <p className='pages_links'><a href="privacy-policy">Privacy Policy</a> | <a href="/about-us">About Us</a></p>
                </div>
                <p className='social_links'>
                    <a href='https://www.alquds.edu/' target='_blank' rel='noopener noreferrer'><LanguageIcon /></a>
                    <a href='https://ps.linkedin.com/school/alquds-university/' target='_blank' rel='noopener noreferrer'><LinkedInIcon /></a>
                    <a href='https://www.instagram.com/alquds.university' target='_blank' rel='noopener noreferrer'><InstagramIcon /></a>
                    <a href='https://www.youtube.com/@AlQudsUniv' target='_blank' rel='noopener noreferrer'><YouTubeIcon /></a>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Footer