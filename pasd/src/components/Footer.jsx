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
                <div className='footer_links d-flex gap-3'>
                    <p className='pages_links mb-0'><a href="privacy-policy">Privacy Policy</a> | <a href="/about-us">About Us</a> | <a href="/support-us">Contact</a></p>
                </div>
                <div className='footer_bottom'>
                <p className='mb-0'>© {new Date().getFullYear()} All copyrights reserved for Al-Quds University, Palestine, Jerusalem.</p>
                <p className='social_links mb-0'>
                        <a href='https://www.alquds.edu/' target='_blank' className='logo'><img src="https://www.alquds.edu/wp-content/uploads/2022/02/black-logo.png" alt="AQU LOGO" /></a>
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer