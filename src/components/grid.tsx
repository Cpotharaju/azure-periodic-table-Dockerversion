/* src/components/grid.tsx */

import type { Categories } from '@/app/constants';
import type { CompassData } from './compass';
import Image from 'next/image';
import type { Item } from '@/app/data';
import { createRef, useEffect, useLayoutEffect, useRef } from 'react';
import useMobile from '@/custom-hooks/use-mobile';

interface CellProps {
  item: Item;
  zoomLevel?: 0 | 1 | 2;
  activeCategory: Categories | null;
  setActiveCategory: (category: Categories | null) => void;
  select: () => void;
  setActiveElement: (element: any) => void;
  compassData: CompassData;
  textSearch: string;
}

const Cell: React.FC<CellProps> = ({
  item,
  zoomLevel = 0,
  activeCategory,
  select,
  setActiveElement,
  compassData,
  textSearch,
}) => {
  const ref = useRef<HTMLDivElement>(null); // Create a ref

  const color = compassData.find((c) => c.name === item.category)?.color;

  const height =
    zoomLevel === 0 ? 'h-16' : zoomLevel === 1 ? 'h-[70px]' : 'h-28';
  const width =
    zoomLevel === 0 ? 'w-16' : zoomLevel === 1 ? 'w-[70px]' : 'w-28';

  const isActiveCategory =
    activeCategory === null || activeCategory === item.category;

  const isActiveSearch =
    textSearch === '' ||
    item.name.toLowerCase().includes(textSearch.toLowerCase()) ||
    item.slug.toLowerCase().includes(textSearch.toLowerCase());

  // disable if there is a search and the item is not in the search
  // or if there is a category and the item is not in the category

  const isDisabled = !isActiveCategory || !isActiveSearch;

  const colorOption = isDisabled ? 'bg-gray-400' : color;

  const transparent = isDisabled ? 'opacity-50' : 'opacity-100';

  const hoverScale = isDisabled ? '' : 'hover:scale-150';

  const isMobile = useMobile();

  // Detect when the cell becomes the active category and scroll into view
  useLayoutEffect(() => {
    if (activeCategory === item.category && isMobile) {
      if (!ref.current) return;

      console.log(ref.current, ' is scrolling into view');

      ref.current.scrollIntoView({
        behavior: 'auto',
      });
    }
  }, [activeCategory, item.category, ref, isMobile]);

  return (
    <div
      ref={ref} // Pass the ref to the div
      onClick={() => {
        if (isDisabled) return;
        setActiveElement(item);
        select();
      }}
      className={`${height} ${width}  dark:border-white border-black border m-0.5 p-1 ${colorOption} ${transparent} justify-center items-center cursor-pointer transition-all ${hoverScale} z-0 hover:z-10 `}
    >
      <div className="flex flex-col  relative h-full w-full">
        <div className="flex w-full justify-between items-center">
          {item.icon ? (
            <Image
              alt={`icon for ${item.name}`}
              width={10}
              height={10}
              className=""
              src={item.icon}
            />
          ) : null}
          <span className="text-[0.5rem]">{item.length ?? '1-100'}</span>
        </div>
        <div className="justify-start w-full font-bold text-xs">
          {item.slug}
        </div>
        <div className="justify-center items-center w-full text-[0.5rem] h-full  overflow-hidden">
          <span>{item.name}</span>
        </div>
      </div>
    </div>
  );
};

interface GridProps {
  items: Item[];
  activeCategory: Categories | null;
  setActiveCategory: (category: Categories | null) => void;
  select: () => void;
  setActiveElement: (element: any) => void;
  compassData: CompassData;
  textSearch: string;
  zoomLevel: 0 | 1 | 2;
}

export const Grid: React.FC<GridProps> = ({
  items,
  activeCategory,
  setActiveCategory,
  select,
  setActiveElement,
  compassData,
  textSearch,
  zoomLevel,
}) => {
  return (
    <div className={`flex flex-col w-fit h-full relative`}>
      {items.map((item, i) => (
        <Cell
          textSearch={textSearch}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          key={i}
          item={item}
          select={select}
          setActiveElement={setActiveElement}
          compassData={compassData}
          zoomLevel={zoomLevel}
        />
      ))}
    </div>
  );
};
