'use client';

import { useState, FormEvent } from 'react';
import { Heading } from "@/components/atom/headers/Heading"
import { SubHeading } from "@/components/atom/headers/SubHeading";
import Image from 'next/image';

interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  source: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    source: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="max-w-6xl font-poppins mt-10">
      <div className="max-w-6xl mx-auto py-5">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <div className="w-full md:w-1/2 bg-white lg:text-left p-2 max-w-[584px] text-center">
             <SubHeading>Contact Us</SubHeading> 
             <br />
            <Heading>Get In Touch</Heading>
            <p className="lg:max-w-md mt-3 mb-4 lg:text-left">
              We understand that you may have questions about our courses, enrollment process, certifications, and more. That&apos;s why we&apos;ve put together this FAQ section to provide clear answers and help you make informed decisions. Explore the most common inquiries below, and if you need further assistance, our support team is always here to help!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center w-full px-4 py-4 border-2 border-gray-300 rounded-md">
                <label htmlFor="name" className="text-sm font-medium text-[#525252] min-w-[100px] flex gap-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full appearance-none border-none outline-none focus:ring-0 focus:border-transparent bg-transparent text-gray-900"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center w-full px-4 py-4 border-2 border-gray-300 rounded-md">
                <label htmlFor="email" className="text-sm font-medium text-[#525252] min-w-[100px] flex gap-2">
                  Email
                </label>
                <input
                  className="w-full appearance-none border-none outline-none focus:ring-0 focus:border-transparent bg-transparent text-gray-900"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center w-full px-4 py-4 border-2 border-gray-300 rounded-md">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-[#525252] min-w-[150px] flex gap-2">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full appearance-none border-none outline-none focus:ring-0 focus:border-transparent bg-transparent text-gray-900"
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-4 border-[1.6px] border-gray-300 rounded-md focus:outline-none focus:ring-[#27156F] focus:border-[#27156F] text-[#27156F]"
                >
                  <option value="" disabled>How did you find us?</option>
                  <option value="social">Social</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E02B20] hover:bg-[#E02B20] focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  SEND
                </button>
              </div>
            </form>

            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-10 md:gap-2 mt-15">
              {[
                {
                  icon: "https://res.cloudinary.com/daqmbfctv/image/upload/v1741092792/Frame_831_cxgaus.png",
                  title: "PHONE",
                  value: "+234 809 938 7853"
                },
                {
                  icon: "https://res.cloudinary.com/daqmbfctv/image/upload/v1741092792/Frame_835_cz07k8.png",
                  title: "FAX",
                  value: "0 809 938 7853"
                },
                {
                  icon: "https://res.cloudinary.com/daqmbfctv/image/upload/v1741092792/Frame_833_czmxeu.png",
                  title: "EMAIL",
                  value: "neca@neca.org.ng"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Image
                    src={item.icon}
                    alt={`${item.title} icon`}
                    width={30}
                    height={40}
                  />
                  <div>
                    <p className="text-[#27156F] font-bold">{item.title}</p>
                    <p className="text-[#E02B20] text-[12px]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-white p-6 flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/daqmbfctv/image/upload/v1741092794/Frame_1618869608_tre0rv.png"
              alt="Contact illustration"
              width={577}
              height={700}
              className="max-w-[577px] h-[700px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
