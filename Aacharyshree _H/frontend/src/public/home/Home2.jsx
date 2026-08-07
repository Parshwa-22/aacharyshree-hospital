// import React from "react";

// const Home = () => {
//   return (
//     <div className="w-full">

//       {/* HERO SECTION */}
//       <section className="relative h-screen max-h-[900px] overflow-hidden">

//         {/* Background */}
//         <div className="absolute inset-0">
//           <img
//             src="/images/hb.jpg"   // ✅ use this path
//             alt="Hospital"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#0A3D91]/70 to-transparent" />
//         </div>

//         {/* Content */}
//         <div className="relative z-10 h-full flex items-center">
//           <div className="w-full max-w-7xl mx-auto px-6 lg:px-10">

//             {/* Heading */}
//             <div className="max-w-xl">
//               <h1 className="text-white font-bold text-5xl md:text-7xl leading-[1.05]">
//                 Aacharyshree <br /> Hospital
//               </h1>

//               {/* Divider */}
//               <div className="flex items-center gap-4 mt-8">
//                 <div className="w-28 h-[2px] bg-[#D4AF37]" />

//                 <svg
//                   className="w-8 h-8 text-[#D4AF37]"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12 2C11 5 9 7 6 9c2 0 4 1 6 3 2-2 4-3 6-3-3-2-5-4-6-7zm0 10c-2 3-5 5-8 5 2 3 5 5 8 5s6-2 8-5c-3 0-6-2-8-5z"/>
//                 </svg>

//                 <div className="w-28 h-[2px] bg-[#D4AF37]" />
//               </div>
//             </div>

//             {/* CENTERED CARDS */}
//             <div className="mt-12 flex justify-center">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                 {[
//                   {
//                     title: "Ayurvedic",
//                     img: "/images/ayurvedic.jpg",
//                     color: "bg-green-100 text-green-700",
//                     icon: "🌿",
//                   },
//                   {
//                     title: "Allopathic",
//                     img: "/images/allopathic.jpg",
//                     color: "bg-blue-100 text-blue-700",
//                     icon: "✚",
//                   },
//                   {
//                     title: "Diagnostic",
//                     img: "/images/diagnostic.jpg",
//                     color: "bg-violet-100 text-violet-700",
//                     icon: "🔬",
//                   },
//                 ].map((card, index) => (
//                   <div
//                     key={index}
//                     className="group w-[260px] h-[250px] rounded-[22px] overflow-hidden bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
//                   >

//                     {/* Image */}
//                     <div className="h-[68%] overflow-hidden">
//                       <img
//                         src={card.img}
//                         alt={card.title}
//                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                       />
//                     </div>

//                     {/* Bottom Section */}
//                     <div className="h-[32%] flex flex-col items-center justify-center gap-2">

//                       <h3 className="text-sm font-semibold text-slate-800">
//                         {card.title}
//                       </h3>

//                       <div className={`${card.color} w-8 h-8 rounded-full flex items-center justify-center text-base shadow-md`}>
//                         {card.icon}
//                       </div>

//                     </div>

//                   </div>
//                 ))}

//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//     </div>
//   );
// };

// export default Home;