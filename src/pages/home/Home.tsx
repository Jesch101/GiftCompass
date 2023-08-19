import React from 'react';
import { Link } from 'react-router-dom';
import hero_img from '../../assets/undraw_community.svg';
import { FaCalendarDays, FaGift } from 'react-icons/fa6';
import { LuPartyPopper } from 'react-icons/lu';

const Home = () => {
  return (
    <section className='mx-auto w-[85%] max-w-[100vw] pb-16 pt-10'>
      <div className='grid grid-cols-2 grid-rows-1 gap-0'>
        <div className='prose pl-1 pt-10'>
          <h1 className='text-6xl'>
            <span className='text-accent'>Effortless</span> Event Organizing
          </h1>
          <p className='text-lg'>
            Whether it's a birthday, wedding, holiday gathering, or any special
            occasion, our intuitive tools make event creation and management a
            seamless experience.
          </p>
          <p className='text-lg'>
            Set event details, invite guests, and keep everyone in the loop for
            a coordinated gift-giving experience.
          </p>
          <div className='flex flex-row space-x-4'>
            <Link
              to='/signup'
              className='btn btn-accent'>
              Get Started
            </Link>
            <button className='btn btn-neutral'>Learn More</button>
          </div>
        </div>
        <div>
          <img
            src={hero_img}
            className='h-auto w-full'
            alt='Hero Image'
          />
        </div>
      </div>
      <section className='mt-72'>
        <div className='mb-12 flex justify-center align-middle'>
          <h2 className='text-4xl'>Why GiftCompass?</h2>
        </div>
        <div className='flex justify-center'>
          <div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
            <div className='card mx-auto w-full bg-neutral text-neutral-content md:w-80'>
              <div className='group card-body transform items-center text-center transition-all hover:scale-110'>
                <FaCalendarDays className='h-16 w-auto transform text-accent transition-transform group-hover:animate-pulse' />
                <h2 className='card-title'>Seamless Gift Planning</h2>
                <p>
                  Effortlessly create events, manage guest lists, and track gift
                  preferences in one place with GiftCompass.
                </p>
              </div>
            </div>
            <div className='group card mx-auto w-full transform bg-neutral text-neutral-content transition-all hover:scale-110 md:w-80'>
              <div className='card-body items-center text-center'>
                <FaGift className='h-16 w-auto transform text-accent transition-transform group-hover:animate-bounce' />
                <h2 className='card-title'>Thoughtful Gift Selection</h2>
                <p>
                  Share your gift preferences and wish lists, allowing loved
                  ones to choose presents that truly reflect your desires.
                </p>
              </div>
            </div>
            <div className=' group card mx-auto w-full transform bg-neutral text-neutral-content transition-all hover:scale-110 md:w-80'>
              <div className='card-body items-center text-center'>
                <LuPartyPopper className='h-16 w-auto transform text-accent transition-transform group-hover:rotate-12' />
                <h2 className='card-title'>Personalized Celebrations</h2>
                <p>
                  Create unique celebrations with customized themes and event
                  details using GiftCompass.
                </p>
              </div>
            </div>
            <div className='card col-span-1 mx-auto w-full bg-neutral text-neutral-content md:col-span-3'>
              <div className='card-body'>
                <h2 className='card-title'>How Does It Work?</h2>
                <p>
                  Effortlessly navigate the gift-giving process in 4 easy steps.
                </p>
                <p>WIP</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;
