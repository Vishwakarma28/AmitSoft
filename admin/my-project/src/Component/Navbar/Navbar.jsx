import navlogo from '../../assets/nav-logo.svg'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='Navbar flex items-center justify-between py-3 px-16  bg-white'>
      <img src={navlogo} alt="" className='nav-logo w-48' />
      <img src={navProfile} alt="" className='nav-Profile w-20'/>
    </div>
  )
}

export default Navbar
