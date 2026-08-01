import { Link } from "react-router-dom";
import { useGymSettings } from "../../hooks/useGymSettings";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

function Footer(){

  const { settings, loading } = useGymSettings();

if (loading) return null;
return(

<footer className="bg-black text-white py-16">

<div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-10">


<div>

<h2 className="text-3xl font-bold text-pink-500">
Malkia Fitness
</h2>

<p className="mt-5 text-gray-400">
Empowering women through fitness, confidence and community.
</p>

</div>



<div>

<h3 className="font-bold text-xl mb-5">
Quick Links
</h3>

<div className="space-y-3 text-gray-400">

<Link to="/">Home</Link>
<br/>
<Link to="/about">About</Link>
<br/>
<Link to="/membership">Membership</Link>
<br/>
<Link to="/trainers">Trainers</Link>
<br/>
<Link to="/gallery">Gallery</Link>
<br/>
<Link to="/contact">Contact</Link>

</div>

</div>



<div>

<h3 className="font-bold text-xl mb-5">
Contact
</h3>

<p className="text-gray-400">
{settings.address}
</p>

<p className="text-gray-400">
{settings.phone}
</p>

<p className="text-gray-400">
{settings.email}
</p>


</div>



<div>

<h3 className="font-bold text-xl mb-5">
Follow Us
</h3>

<div className="flex gap-5 text-pink-500 text-2xl">

<a
href={settings.instagram}
target="_blank"
rel="noreferrer"
>
<FaInstagram/>
</a>
<a
href={settings.facebook}
target="_blank"
rel="noreferrer"
>
<FaFacebook/>
</a>
<a
href={settings.whatsapp}
target="_blank"
rel="noreferrer"
>
<FaWhatsapp/>
</a>

</div>

</div>


</div>


<div className="text-center mt-12 text-gray-500">

© {new Date().getFullYear()} Malkia Fitness. All Rights Reserved.

</div>


</footer>

)

}

export default Footer;