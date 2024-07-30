import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Nav = () => {
    // Exists on top of the page
    // Not sure if this should be on the quiz page or if this should become a sidebar.
    // Contains the Name on the left most side,
    return (
        <nav className='nav_bar'>
            <Link className='nav_logo' href='/'>
                <Image
                    src="/assets/imgs/logo-no-background.png"
                    width={250}
                    height={22.5}
                    alt='Prep & Learn Logo'
                />
            </Link>
            <div className="rightNav">
                <Link className='nav_links' href='/practices'>
                    GED exams Practice Tests
                </Link>
                <Link className='lockedLinks nav_links' href='/study_bits'>
                    HESI exams practice tests
                </Link>
                <Link className='lockedLinks nav_links' href='/about'>
                TEAS exams practice tests
                </Link>
                <Link className='lockedLinks nav_links' href='/contribute'>
                    Other proctored exams
                </Link>
            </div>
        </nav>
    )
}

export default Nav
