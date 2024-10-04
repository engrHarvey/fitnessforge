import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121212] text-gray-400 py-4 w-full text-center border-t border-gray-800">
      <div className="max-w-screen-lg mx-auto px-4">
        {/* Footer Content Container */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Left Content */}
          <p className="text-xs sm:text-sm">
            © {currentYear} Harvey Abantao. All Rights Reserved.
          </p>

          {/* Social Media Links */}
          <div className="space-x-3">
            <a
              href="https://www.facebook.com/profile.php?id=61556358786809"
              className="text-gray-400 hover:text-[#FF5733] transition duration-300"
              aria-label="Facebook"
            >
              <FaFacebook size={18} />
            </a>
            <a
              href="https://x.com/AbantaoHar92607"
              className="text-gray-400 hover:text-[#FF5733] transition duration-300"
              aria-label="Twitter"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://www.instagram.com/ehabantao07/"
              className="text-gray-400 hover:text-[#FF5733] transition duration-300"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/harvey-abantao-a166a1124/"
              className="text-gray-400 hover:text-[#FF5733] transition duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
          </div>
        </div>

        {/* Optional Extra Links for Larger Screens */}
        <div className="mt-3 text-xs sm:text-sm space-x-3 sm:space-x-6">
          <a href="#" className="hover:text-white transition duration-200">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition duration-200">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition duration-200">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
