import React from 'react';

const TestimonialCard = ({ imageUrl, text, name, title }) => {
  return (
    <div className="w-[297px] min-h-[393px] bg-white rounded-[15.73px] border border-[#e5e7eb] p-[18.87px_14.68px_18.87px_23.07px] flex flex-col items-center justify-between shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#3A0CA3] group mt-12 mb-4">
      <img src={imageUrl} alt={name} className="w-[149.93px] h-[135.61px] object-cover rounded-full mb-5" />
      <div className="flex flex-col gap-[18.87px] w-full items-center">
        <p className="font-urbanist font-normal text-[18.87px] text-[#4b5563] text-center leading-normal group-hover:text-white">
          {text}
        </p>
        <h2 className="font-urbanist font-bold text-[25.16px] text-black text-center m-0 group-hover:text-white">
          {name}
        </h2>
        <p className="font-urbanist font-normal text-[18.87px] text-black text-center m-0 group-hover:text-white">
          {title}
        </p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      imageUrl: "https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img.png",
      text: "This platform offers great internships and structured roadmaps, helping me gain experience and grow my career.",
      name: "Emily Roberts",
      title: "Cyber Security Engineer"
    },
    {
      imageUrl: "https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-2.png",
      text: "As a professor, this platform has been an invaluable resource. It has enhanced my knowledge & my teaching methods in ways.",
      name: "Prof. Jeo Denmark",
      title: "Software Engineer"
    },
    {
      imageUrl: "https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-3.png",
      text: "This platform has significantly boosted my career. The resources and opportunities have helped me grow professionally like never before.",
      name: "Kevin Joseph",
      title: "Data Scientist"
    },
    {
      imageUrl: "https://dashboard.codeparrot.ai/api/image/Z8czSxQ2u-KHiHW2/img-4.png",
      text: "This platform has significantly boosted my career. The resources and opportunities have helped me grow professionally like never before.",
      name: "Monica Gartner",
      title: "Graphics Engineer"
    }
  ];

  return (
    <div className="font-urbanist bg-[#3A0CA3] text-white w-full min-h-screen flex flex-col items-center justify-center p-2.5">
      <h1 className="text-[48px] font-bold -mt-[150px] mb-10">
        Testimonials
      </h1>
      <div className="flex flex-row flex-wrap gap-[39px] justify-center mb-0 pb-0">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            imageUrl={testimonial.imageUrl}
            text={testimonial.text}
            name={testimonial.name}
            title={testimonial.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;