import React from 'react'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import '../css/footer.css';

const Footer = () => {
  return (
    <div className='footer_container'>
        <div className="wrapper">
            <div className='footer_bottom'>
                <div className='d-flex flex-column gap-3'>
                    <p className='social_links mb-0'>
                        <a href='https://ps.linkedin.com/school/alquds-university/' target='_blank' rel='noopener noreferrer'><LinkedInIcon /></a>
                        <a href='https://www.instagram.com/alquds.university' target='_blank' rel='noopener noreferrer'><InstagramIcon /></a>
                        <a href='https://www.youtube.com/@AlQudsUniv' target='_blank' rel='noopener noreferrer'><YouTubeIcon /></a>
                    </p>
                    <p className='mb-0'>© {new Date().getFullYear()} All copyrights reserved for Al-Quds University, Palestine, Jerusalem.</p>
                    <p className='pages_links mb-0'><a href="privacy-policy">Privacy Policy</a> | <a href="/about-us">About Us</a> | <a href="/support-us">Contact</a></p>
                </div>
                <a href='https://www.alquds.edu/' target='_blank' className='logo'><img src="https://www.alquds.edu/wp-content/uploads/2022/02/black-logo.png" alt="AQU LOGO" /></a>

            </div>
        </div>
    </div>
  )
}

export default Footer