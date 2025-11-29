import React from 'react'

const Footer = () => {
  return (
    <footer id="footer" className="bg-[var(--brand-blue)] text-white py-10 px-6 text-center">
        <h3 className="text-2xl font-semibold mb-3">Contact Us for Customization</h3>
        <h3 className="text-md font-semibold ">Let’s Create Something Unique ✨</h3>
        <p className="mb-6 opacity-80">Tell us your idea — we’ll make it real.</p>

        <div className="flex justify-center gap-6 text-2xl">
            <a
            href="https://wa.me/918328162488"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:scale-110 transition-transform"
            >
            <i className="fab fa-whatsapp"></i>
            </a>
            <a
            href="https://instagram.com/__art__soul___"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
            >
            <i className="fab fa-instagram"></i>
            </a>
            <a
            href="mailto:dheerajartworksOfficial@gmail.com"
            className="hover:scale-110 transition-transform"
            >
            <i className="fas fa-envelope"></i>
            </a>
        </div>

        <p className="mt-6 text-sm opacity-70">© {new Date().getFullYear()} Artify | Crafted with ❤️</p>
    </footer>

  )
}

export default Footer