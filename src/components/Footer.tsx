import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import svg_logo from '../assets/SVG Logo.svg';

const Footer = () => {
  return (
    <footer className='footer items-center bg-neutral p-4 text-neutral-content'>
      <div className='grid-flow-col items-center'>
        <img
          src={svg_logo}
          className='h-10 w-auto'
          alt='Logo'
        />
        <p>Copyright © 2023 - All right reserved</p>
      </div>
      <div className='grid-flow-col gap-4 md:place-self-center md:justify-self-end'>
        <a
          className='btn btn-square btn-ghost'
          href='https://www.linkedin.com/in/jeremy-esch/'
          target='_blank'
          rel='noopener noreferrer'>
          <FaLinkedin size={32} />
        </a>
        <a
          className='btn btn-square btn-ghost'
          href='https://github.com/Jesch101'
          target='_blank'
          rel='noopener noreferrer'>
          <FaGithub size={32} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
