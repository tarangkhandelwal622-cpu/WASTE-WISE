import React from 'react';

// 28 unique images combining our generated tiles and specific high-quality stock photos
const gridItems = [
  '/bg-tiles/orange-peels.png',
  '/bg-tiles/old-phones.png',
  '/bg-tiles/dustbin.png',
  '/bg-tiles/batteries.png',
  '/bg-tiles/lipstick.png',
  '/bg-tiles/cardboard.png',
  '/bg-tiles/plastic.png',
  'https://upload.wikimedia.org/wikipedia/commons/e/e5/Compost_site_germany.JPG', // Compost
  'https://upload.wikimedia.org/wikipedia/commons/b/b6/Spices1.jpg', // Spice
  'https://upload.wikimedia.org/wikipedia/commons/b/b4/Gluehlampe_01_KMJ.png', // Incandescent light bulb
  'https://upload.wikimedia.org/wikipedia/commons/b/b0/BroomsforSale.jpg', // Broom
  'https://upload.wikimedia.org/wikipedia/commons/a/a4/SEG_DVD_430_-_Printed_circuit_board-4276.jpg', // Printed circuit board
  'https://upload.wikimedia.org/wikipedia/commons/b/bc/Cosmetics.JPG', // Cosmetics
  'https://upload.wikimedia.org/wikipedia/commons/5/5e/Allegheny_Ludlum_Steel_Corp_Scrap_Piles.jpg', // Scrap / Metal Scraps
  'https://upload.wikimedia.org/wikipedia/commons/a/a1/Trash_bin_in_Paris.jpg', // Plastic bag / Polythenes
  'https://upload.wikimedia.org/wikipedia/commons/a/a7/NEA_recycling_bins%2C_Orchard_Road.JPG', // Recycling bin
  'https://upload.wikimedia.org/wikipedia/commons/e/eb/Box.agr.jpg', // Cardboard box
  'https://upload.wikimedia.org/wikipedia/commons/6/69/Car_Battery_Charger.jpg', // Battery charger / Charger
  'https://upload.wikimedia.org/wikipedia/commons/4/48/Cocacolacollection.JPG', // Glass bottle
  'https://upload.wikimedia.org/wikipedia/commons/3/30/Ewaste-pile.jpg', // Electronic waste
  'https://upload.wikimedia.org/wikipedia/commons/2/24/Marketvegetables.jpg', // Vegetable
  'https://upload.wikimedia.org/wikipedia/commons/b/bd/Antifreeze.jpg', // Plastic bottle
  'https://upload.wikimedia.org/wikipedia/commons/e/e1/Loose_powder_in_three_shades_-_%CE%95%CE%BB%CE%B5%CF%8D%CE%B8%CE%B5%CF%81%CE%B5%CF%82_%CF%80%CE%BF%CF%8D%CE%B4%CF%81%CE%B5%CF%82_%CF%83%CE%B5_%CF%84%CF%81%CE%B5%CE%B9%CF%82_%CE%B1%CF%80%CE%BF%CF%87%CF%81%CF%8E%CF%83%CE%B5%CE%B9%CF%82.JPG', // Face powder / Powder
  'https://upload.wikimedia.org/wikipedia/commons/8/8d/Mobile_Phone_Evolution_1992_-_2014.jpg', // Mobile phone
  'https://upload.wikimedia.org/wikipedia/commons/8/8b/Shredded_solid_waste.jpg', // Shredded waste
  'https://upload.wikimedia.org/wikipedia/commons/a/a3/Women_Making_Batik%2C_Ketelan_crop.jpg', // Handicraft / Craft things
  'https://upload.wikimedia.org/wikipedia/commons/1/16/Paper_recycling_in_Ponte_a_Serraglio.JPG', // Paper recycling
  'https://upload.wikimedia.org/wikipedia/commons/a/a6/Pink_lady_and_cross_section.jpg', // Rotten fruit / Apple
];

export default function GridBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#f8f6ff]">
      {/* Light frosted overlay with a slight blur for readability */}
      <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-[3px]" />

      {/* Grid of 28 items, sized so they cover the screen (fewer columns = larger items) */}
      <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 p-3 select-none pointer-events-none overflow-hidden">
        {gridItems.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-md opacity-80 bg-gray-200/50"
          >
            <img
              src={src}
              alt="WasteWise Item"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
