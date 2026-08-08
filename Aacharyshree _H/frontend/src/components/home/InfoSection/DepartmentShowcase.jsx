import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DepartmentSection from "./DepartmentSection";
import { fetchDepartments } from "../../../api/publicApi";
import { getTranslated } from "../../../utils/translate";

function mapDepartment(dept, lang) {
  const services = getTranslated(dept, "services", lang) || "";
  return {
    id: dept.id,
    slug: dept.slug,
    title: getTranslated(dept, "title", lang),
    image: dept.image,
    description: getTranslated(dept, "description", lang),
    services: services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export default function DepartmentShowcase() {
  const { i18n } = useTranslation();
  const [rawDepartments, setRawDepartments] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchDepartments().then((data) => {
      if (cancelled) return;
      setRawDepartments(data);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const departments = rawDepartments.map((d) => mapDepartment(d, i18n.language));

  if (loaded && departments.length === 0) return null;

  return (
    <section className="bg-[#F8FAFD] py-5 md:py-10">
      <div className="mx-auto max-w-[1800px]">
        {departments.map((department, index) => (
          <DepartmentSection
            key={department.id}
            department={department}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
}
