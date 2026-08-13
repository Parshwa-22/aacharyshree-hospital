import AvailabilityBadge from "./AvailabilityBadge";
import AvailabilityDetails from "./AvailabilityDetails";
import SpecializationText from "./SpecializationText";

export default function DoctorProfileCard({ doctor, specialization, department, appointmentPhone }) {
  const experience = doctor.experience?.trim();
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <img src={doctor.image} alt={doctor.name} className="block h-full w-full object-contain object-center" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-[#00c6ff] to-[#00d9a5] px-4 py-2.5 text-center text-base font-bold text-white shadow-md">{doctor.name}</div>
      </div>
      <div className="flex flex-1 flex-col p-5 text-center">
        <SpecializationText className="min-h-[2.75rem] text-[15px] leading-5 text-[#0f2742]">{specialization}</SpecializationText>
        <div className="mt-3 space-y-2 text-left">
          {department && <div className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-bold text-sky-700"><span className="mr-1 text-sky-500">Department:</span>{department}</div>}
          {doctor.qualification && <div className="rounded-lg bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700"><span className="mr-1 text-violet-500">Qualification:</span>{doctor.qualification}</div>}
        </div>
        {experience && <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800"><span className="mr-1">Experience:</span>{experience}{experience.toLowerCase().includes("year") ? "" : " years"}</div>}
        <div className="mt-3 flex justify-center"><AvailabilityBadge doctor={doctor} /></div>
        <AvailabilityDetails doctor={doctor} />
        {appointmentPhone && <a href={`tel:${appointmentPhone}`} className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#0f2742] to-[#1e4d6b] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg">Book Appointment</a>}
      </div>
    </article>
  );
}
