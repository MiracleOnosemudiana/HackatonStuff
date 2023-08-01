import Link from 'next/link';
import React from 'react';
// import { AiOutLineMenu, AiOutLineClose } from 'react-icons'


const Navbar = () => {
    /*
    const [ nav, setNav] = useState(false)

    const handleNav = () => {
        setNav(!nav)
    }
    
    */
     
  return (
    <div className=' fixed left-0 top-0 w-full z-10 ease-in duration-300' >
        <div className=' max-w-[1240px] m-auto flex justify-between items-center p-4 text-white'>
            <Link href='/'>
                <h1 className=' font-bold text-4xl'>LOGO</h1>
            </Link>

            <ul className=' hidden sm:flex'>
                <li className='p-5'>
                    <Link href='/'>Home</Link>
                </li>
                <li className='p-5'>
                    <Link href='/browse-paper'>Browse Paper</Link>
                </li>
                <li className='p-5'>
                    <Link href='/submit-paper'>Submit Paper</Link>
                </li>
                <li className='p-5'>
                    <Link href='/about-us'>About Us</Link>
                </li>
                <li className='p-5'>
                    <Link href='/contact'>Contact</Link>
                </li>
            </ul>

            {/* Mobile Button
            <div className='block sm:hidden z-10'>
                <AiOutLineMenu size={20} />
            </div>
            //{ Mobile Menu }
            <div className=' absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-black text-center       ease-in duration-300'>
                <ul className=' hidden sm:flex'>
                    <li className='p-5'>
                        <Link href='/'>Home</Link>
                    </li>
                    <li className='p-5'>
                        <Link href='/browse-paper'>Browse Paper</Link>
                    </li>
                    <li className='p-5'>
                        <Link href='/submit-paper'>Submit Paper</Link>
                    </li>
                    <li className='p-5'>
                        <Link href='/about-us'>About Us</Link>
                    </li>
                    <li className='p-5'>
                        <Link href='/contact'>Contact</Link>
                    </li>
                </ul>
            </div> */}
            
        </div>
    </div>
  )
};

export default Navbar;