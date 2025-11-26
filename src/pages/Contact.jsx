import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Music, Instagram, Youtube, Share2 } from "lucide-react";

export default function Contact() {
  return (
    <section className="pt-32 pb-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Contact <span className="text-red-500">ARC Musicals</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            For collaborations, music production, distribution, or business inquiries,
            reach out directly to our co-founder.
          </p>
        </motion.div>

        {/* VIPUL CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 shadow-xl border border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* IMAGE */}
            <motion.img
              src="/assets/vipul.jpg" // <-- replace with actual image
              alt="Mr. Vipul Rajput"
              className="w-48 h-48 object-cover rounded-2xl shadow-2xl border border-gray-700"
              whileHover={{ scale: 1.05 }}
            />

            {/* INFO */}
            <div>
              <h2 className="text-4xl font-bold">Mr. Vipul Rajput</h2>
              <p className="text-red-500 font-semibold mt-1">
                Co-founder • ARC Musicals
              </p>

              <p className="text-gray-300 mt-4 leading-relaxed max-w-xl">
                Music Producer | Composer | Lyrics Writer | Vocal Artist  
                Helping independent artists bring their musical vision to life through
                premium production and industry-level expertise.
              </p>

              {/* CONTACT DETAILS */}
              <div className="mt-6 space-y-3">
                <ContactRow icon={<Mail />} label="Email" value="arcstudios.india@gmail.com" />
                <ContactRow icon={<Phone />} label="Phone" value="+91 98XX-XXXXXX" />
                <ContactRow icon={<Music />} label="Studio" value="ARC Musicals Production House" />
                <ContactRow
                  icon={<MapPin />}
                  label="Location"
                  value="Mumbai • Maharashtra, India"
                />
              </div>

              {/* SOCIALS */}
              <div className="flex gap-6 mt-8">
                <SocialIcon icon={<Instagram />} url="#" />
                <SocialIcon icon={<Youtube />} url="#" />
                <SocialIcon icon={<Share2 />} url="#" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-4xl font-extrabold mb-6">Send a Message</h2>

          <div className="bg-gray-900 p-10 rounded-3xl shadow-xl border border-gray-800">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Your Name" />
              <Input label="Email Address" />
              <Input label="Phone Number" />
              <Input label="Subject" />

              <div className="md:col-span-2">
                <label className="text-gray-400 block mb-1 ml-1">Message</label>
                <textarea
                  className="w-full p-4 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="6"
                  placeholder="Write your message here..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="md:col-span-2 mt-4 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-bold tracking-wide shadow-lg"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Input({ label }) {
  return (
    <div>
      <label className="text-gray-400 block mb-1 ml-1">{label}</label>
      <input
        type="text"
        className="w-full p-4 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

function ContactRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-red-500 text-xl">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SocialIcon({ icon, url }) {
  return (
    <motion.a
      whileHover={{ scale: 1.15 }}
      href={url}
      target="_blank"
      className="p-3 rounded-xl bg-gray-800 hover:bg-red-600 transition shadow-lg"
    >
      <div className="text-white text-xl">{icon}</div>
    </motion.a>
  );
}
