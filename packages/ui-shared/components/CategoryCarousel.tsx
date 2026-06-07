import React, { useRef, useState } from 'react';

interface CategoryCarouselProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryCarousel({ categories, activeCategory, onSelectCategory }: CategoryCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // adjust scrolling speed
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={carouselRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
      className={`
        carousel-container
        flex gap-3 overflow-x-auto px-4 py-2 
        [&::-webkit-scrollbar]:hidden
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
    >
      <style>{`
        .carousel-container::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-
              semibold uppercase 
              transition-all duration-300 ease-in-out cursor-pointer
              ${isActive
                ? 'bg-(--Primary) text-(--Text-dark)' // Active state (Yellow)
                : 'bg-(--Button-background) text-(--Text-primary-off) hover:brightness-110' // Inactive state (Dark Gray)
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}