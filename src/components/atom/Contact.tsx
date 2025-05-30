"use client";

import Image from "next/image";
import { useState, FormEvent, useRef } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { SubHeading } from "@/components/atom/headers/SubHeading";

interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  source: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    source: "",
  });
  const [showFallback, setShowFallback] = useState(false);
  const mailtoRef = useRef<HTMLAnchorElement>(null);
  const [isMap1Loaded, setIsMap1Loaded] = useState(false);
  const [isMap2Loaded, setIsMap2Loaded] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, phoneNumber, source } = formData;
    const subject = encodeURIComponent("Contact Request from Website");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nHow did you find us?: ${source}\n\nPlease provide more context here:`
    );
    const mailto = `mailto:contact@necaictacademy.org?subject=${subject}&body=${body}`;
    if (mailtoRef.current) {
      mailtoRef.current.href = mailto;
      mailtoRef.current.click();
    }
    setShowFallback(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setShowFallback(false);
  };

  return (
    <section className='max-w-6xl font-poppins mt-10'>
      <div className='max-w-6xl mx-auto py-5 min-[1225px]:px-4'>
        <div className='flex flex-col min-[1225px]:flex-row space-y-2 md:space-y-0 md:space-x-5 gap-5'>
          <div className='w-full min-[1225px]:w-1/2 mx-auto bg-white min-[1225px]:text-left min-[1225px]:p-2 max-w-[584px]'>
            <SubHeading>Contact Us</SubHeading>
            <br />
            <h2 className='font-bold text-[24px] md:text-[30px] text-[#27156F] leading-normal md:leading-[40px]'>
              Get In Touch
            </h2>
            <p className='min-[1225px]:max-w-xl mt-2 mb-6.5 min-[1225px]:text-left min-[1225px]:text-[18px]'>
              We understand that you may have questions about our courses,
              enrollment process, certifications, and more. That&apos;s why
              we&apos;ve put together this FAQ section to provide clear answers
              and help you make informed decisions. Explore the most common
              inquiries below, and if you need further assistance, our support
              team is always here to help!
            </p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='flex items-center w-full px-4 py-4 border-2 border-gray-300 rounded-md'>
                <label
                  htmlFor='name'
                  className='text-sm font-medium text-[#525252] min-w-[100px] flex gap-2'
                >
                  Name <span className='text-red-500'>*</span>
                </label>
                <input
                  className='w-full appearance-none border-none outline-none focus:ring-0 focus:border-transparent bg-transparent text-gray-900'
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='flex items-center w-full px-4 py-4 border-2 border-gray-300 rounded-md'>
                <label
                  htmlFor='email'
                  className='text-sm font-medium text-[#525252] min-w-[100px] flex gap-2'
                >
                  Email
                </label>
                <input
                  className='w-full appearance-none border-none outline-none focus:ring-0 focus:border-transparent bg-transparent text-gray-900'
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='flex items-center w-full px-4 py-4 border-2 border-gray-300 rounded-md'>
                <label
                  htmlFor='phoneNumber'
                  className='text-sm font-medium text-[#525252] min-w-[150px] flex gap-2'
                >
                  Phone number <span className='text-red-500'>*</span>
                </label>
                <input
                  className='w-full appearance-none border-none outline-none focus:ring-0 focus:border-transparent bg-transparent text-gray-900'
                  type='tel'
                  id='phoneNumber'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='relative'>
                <select
                  id='source'
                  name='source'
                  value={formData.source}
                  onChange={handleChange}
                  className='mt-1 block w-full px-4 py-4 border-[1.6px] border-gray-300 rounded-md focus:outline-none focus:ring-[#27156F] focus:border-[#27156F] text-[#27156F] appearance-none cursor-pointer'
                >
                  <option value='' disabled>
                    How did you find us?
                  </option>
                  <option value='social'>Social</option>
                  <option value='others'>Others</option>
                </select>
                <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#27156F]'>
                  <MdArrowDropDown size={24} />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E02B20] hover:bg-[#E02B20] focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer'
                >
                  SEND
                </button>
              </div>
            </form>

            {/* Hidden mailto anchor */}
            <a ref={mailtoRef} style={{ display: "none" }}>
              Mail
            </a>

            {/* Fallback message and Gmail link */}
            {showFallback && (
              <div className='mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-900 text-sm'>
                <p>
                  <strong>If your email client did not open:</strong>
                </p>
                <ul className='list-disc ml-5'>
                  <li>
                    You can{" "}
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=contact@necaictacademy.org&su=Contact%20Request%20from%20Website&body=${encodeURIComponent(
                        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone Number: ${formData.phoneNumber}\nHow did you find us?: ${formData.source}\n\nPlease provide more context here:`
                      )}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='underline text-blue-700'
                    >
                      send us an email via Gmail Webmail
                    </a>
                    .
                  </li>
                  <li>
                    Or, email us directly at{" "}
                    <a
                      href='mailto:contact@necaictacademy.org'
                      className='underline text-blue-700'
                    >
                      contact@necaictacademy.org
                    </a>
                  </li>
                </ul>
              </div>
            )}

            <div className='flex flex-row items-center justify-between w-full gap-10 md:gap-2 mt-15 cursor-pointer'>
              {[
                {
                  icon: "https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1741092792/Frame_831_cxgaus.png",
                  title: "PHONE",
                  value: "+234 809 938 7853",
                },
                // {
                //   icon: "https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1741092792/Frame_835_cz07k8.png",
                //   title: "FAX",
                //   value: "0 809 938 7853",
                // },
                {
                  icon: "https://res.cloudinary.com/daqmbfctv/image/upload/e_improve,e_sharpen/v1741092792/Frame_833_czmxeu.png",
                  title: "EMAIL",
                  value: "contact@necaictacademy.org",
                },
              ].map((item, index) => (
                <div key={index} className='flex items-center gap-4'>
                  <Image
                    src={item.icon}
                    alt={`${item.title} icon`}
                    width={30}
                    height={40}
                  />
                  <div>
                    <p className='text-[#27156F] font-bold'>{item.title}</p>
                    <p className='text-[#E02B20] text-[12px]'>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='w-full min-[1225px]:w-1/2 mx-auto bg-white pt-10 gap-4 flex flex-col items-center justify-center max-w-[584px]'>
            <h3 className='text-[#27156F] font-bold text-xl self-start ml-5'>
              Abuja Branch
            </h3>

            <div className='relative w-full h-[400px] min-[1225px]:w-[570px] min-[1225px]:h-[330px] min-[1225px]:ml-14'>
              {!isMap1Loaded && (
                <div className='absolute inset-0 flex items-center justify-center z-10'>
                  <div className='w-full h-full bg-gray-200 animate-pulse rounded-lg' />
                </div>
              )}
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.1500306894045!2d7.485448874049589!3d9.050076288660685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0ba3d6cef4c9%3A0x818eab5a4834a347!2sUnity%20Bank%20PLC!5e0!3m2!1sen!2sng!4v1741878840642!5m2!1sen!2sng'
                width='100%'
                height='400'
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                className='w-full h-full rounded-lg'
                onLoad={() => setIsMap1Loaded(true)}
              ></iframe>
            </div>

            <h3 className='text-[#27156F] font-bold text-xl self-start ml-5'>
              Lagos Branch
            </h3>
            <div className='relative w-full h-[400px] min-[1225px]:w-[570px] min-[1225px]:h-[330px] min-[1225px]:ml-14'>
              {!isMap2Loaded && (
                <div className='absolute inset-0 flex items-center justify-center z-10'>
                  <div className='w-full h-full bg-gray-200 animate-pulse rounded-lg' />
                </div>
              )}
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.1892339823!2d3.352856074645217!3d6.623400993370829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b93b89afbc06d%3A0xce547bf9cde23cfd!2sNECA%20Building!5e0!3m2!1sen!2sng!4v1744028951710!5m2!1sen!2sng'
                width='100%'
                height='400'
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                className='w-full h-full rounded-lg'
                onLoad={() => setIsMap2Loaded(true)}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
