import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const style = {
  header:
    'block sm:flex flex-col sm:flex-row items-center justify-between p-4 bg-white shadow-md sticky top-0 left-0 right-0',
  img: 'flex-shrink-0 cursor-pointer mb-4 sm:mb-0',
  nav: 'flex justify-between sm:justify-end flex-row gap-4 sm:gap-6',
  navLink: 'text-[#DB4A2B] font-bold py-2 px-4 rounded-lg hover:bg-[#DB4A2B]/10 transition-color',
};

const Header = () => {
  return (
    <header className={style.header}>
      <Link href='/'>
        <div className={style.img}>
          <Image src='/logo.png' alt='Logo' width={150} height={50} />
        </div>
      </Link>
      <nav className={style.nav}>
        <Link href='/' className={style.navLink}>
          Home
        </Link>
      </nav>
    </header>
  );
};

export default Header;
