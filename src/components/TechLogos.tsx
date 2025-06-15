
import React from 'react';

const technologies = [
  { name: 'React' },
  { name: 'Vite' },
  { name: 'Tailwind CSS' },
  { name: 'Supabase' },
  { name: 'Clerk' },
];

const TechLogos = () => {
  return (
    <div className="text-center py-4 sm:py-6">
      <p className="text-xs text-muted-foreground mb-3">Proudly built with</p>
      <div className="flex justify-center items-center gap-x-4 sm:gap-x-6 gap-y-2 flex-wrap">
        {technologies.map((tech) => (
          <span key={tech.name} className="text-xs sm:text-sm font-medium text-muted-foreground/80 hover:text-foreground transition-colors">
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TechLogos;
