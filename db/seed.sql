-- Seed data for Blue Harbour Aquarium.
-- Content is original and written for this project. Image files are sourced
-- from Pexels under the Pexels licence; attribution is recorded per row and
-- surfaced on the credits page.

INSERT INTO zones (slug, name, tagline, description, conservation, image_file, image_alt, image_credit, display_order) VALUES
('coral-reef',
 'Coral Reef Zone',
 'A living city beneath the waves',
 'Warm, shallow water and constant sunlight make coral reefs the most crowded habitat in the ocean. Our reef gallery holds 180,000 litres of water at a steady 26°C, home to clownfish, regal tangs, cleaner wrasse and three species of hard coral grown in our own propagation lab.',
 'Reefs worldwide have declined sharply as ocean temperatures rise. Our propagation lab grows coral fragments that are shared with other aquariums and with reef restoration projects, reducing the need to collect from the wild.',
 'coral-reef.jpg',
 'A shoal of small orange and blue fish moving over a shallow coral reef',
 'Photo by Francesco Ungaro on Pexels',
 1),

('deep-sea',
 'Deep Sea Trench',
 'Where sunlight never reaches',
 'Below 1,000 metres the ocean is permanently dark and close to freezing. This zone is lit only to the level the animals can tolerate, so your eyes will take a few minutes to adjust. Look for spider crabs, chimaera and the slow drift of sea pens across the trench floor.',
 'Deep sea habitats are increasingly threatened by seabed trawling and proposed mining for metal nodules. We contribute specimen data to a national deep water monitoring programme.',
 'deep-sea.jpg',
 'A pale jellyfish drifting in near-total darkness',
 'Photo by Nick Bondarev on Pexels',
 2),

('rockpools',
 'Coastal Rockpools',
 'The shoreline you can reach into',
 'Every tide leaves behind a temporary world in the rocks along our coast. This zone recreates a stretch of British shoreline, complete with a working tidal cycle that fills and empties twice each day. Shore crabs, beadlet anemones, blennies and starfish all live here.',
 'Rockpool species are among the first affected by coastal pollution and plastic waste. We run monthly beach cleans with local volunteers and record our findings for the Marine Conservation Society.',
 'rockpools.jpg',
 'A shallow rockpool between dark rocks, with seaweed visible below the surface',
 'Photo by Kris Mikael Krister on Pexels',
 3),

('rivers-rainforest',
 'Freshwater Rivers & Rainforest',
 'From mountain stream to flooded forest',
 'Only a small fraction of the world''s water is fresh, yet it supports a remarkable share of all fish species. This humid, planted zone follows water from fast upland streams down into the flooded forests of the Amazon basin, where fish swim between the trunks of submerged trees.',
 'Freshwater fish are the most threatened vertebrate group on earth, largely through habitat loss. We take part in a European breeding programme for three endangered river species.',
 'rivers-rainforest.jpg',
 'Dense green rainforest vegetation overhanging a slow-moving river',
 'Photo by Tom Fisk on Pexels',
 4);

INSERT INTO experiences (zone_id, name, type, description, duration, accessibility, sensory_note) VALUES
(1, 'The Reef Wall', 'Tank exhibit', 'A six-metre curved viewing panel looking into the full depth of the reef tank. Bench seating runs the length of the wall.', 'Open all day', 'Step-free with seating at viewing height', 'Bright lighting on a natural daylight cycle'),
(1, 'Coral Lab Window', 'Interactive', 'Watch our aquarists tending coral fragments in the propagation lab, with a touchscreen explaining how a single fragment becomes a new colony.', '10 minutes', 'Touchscreen mounted at 900mm with audio description', 'Quiet area'),
(1, 'Reef Feeding Talk', 'Talk', 'A diver enters the reef tank and talks to visitors through an underwater microphone while feeding the shoal.', '20 minutes, daily at 11am', 'Seating provided, hearing loop fitted', 'Amplified speech and background crowd noise'),

(2, 'The Descent', 'Interactive', 'A gently sloping walkway where the lighting and soundscape change as you descend, showing how conditions shift with depth.', '5 minutes', 'Gradient below 1:20, handrails both sides', 'Progressive dimming and low ambient sound'),
(2, 'Trench Viewing Gallery', 'Tank exhibit', 'A cold, dark tank holding species from below 1,000 metres, lit at levels the animals can tolerate.', 'Open all day', 'Step-free, seating available', 'Very low light throughout'),
(2, 'Pressure Point', 'Hands-on', 'A mechanical rig that lets you feel the force exerted by water at different depths by pressing against a weighted piston.', '5 minutes', 'Operable with one hand, low force required', 'Mechanical clicking sound'),

(3, 'The Touch Pool', 'Hands-on', 'A shallow, open pool where you can gently touch starfish, anemones and shore crabs under the guidance of our team.', '15 minutes', 'Pool rim at 750mm, wheelchair accessible on all sides', 'Wet hands, cool water, busy at weekends'),
(3, 'Tidal Clock', 'Interactive', 'A working model tracking the real tide outside, showing how the rockpool zone fills and empties across the day.', '5 minutes', 'Large high-contrast display, tactile dial', 'Quiet area'),
(3, 'Rockpool Ranger Session', 'Talk', 'A member of our shore team introduces the animals in the pool and explains how to explore a real rockpool without harming it.', '25 minutes, weekends at 2pm', 'Seating provided, hearing loop fitted', 'Group setting, moderate noise'),

(4, 'Flooded Forest', 'Tank exhibit', 'A tall planted tank recreating the Amazon in flood, with fish swimming between submerged tree trunks.', 'Open all day', 'Step-free with a low viewing panel for children and wheelchair users', 'Warm and humid, dappled lighting'),
(4, 'Stream to Sea', 'Interactive', 'A water table where you can divert the flow of a model river and see how changes upstream affect habitats downstream.', '10 minutes', 'Table at 800mm with knee clearance, operable seated', 'Running water, hands get wet'),
(4, 'Rainforest Canopy Walk', 'Interactive', 'A raised planted walkway above the river zone, with amphibian and invertebrate displays at eye level.', '10 minutes', 'Ramped access, lift available as an alternative route', 'Warm, humid, occasional bird calls');

INSERT INTO faqs (category, question, answer, display_order) VALUES
('Visiting', 'What time are you open?', 'We are open every day from 9am to 6pm, including weekends and bank holidays. Last entry is at 5pm.', 1),
('Visiting', 'How long does a visit take?', 'Most visitors spend between two and three hours with us. If you want to catch all four daily talks, allow closer to four hours.', 2),
('Visiting', 'Where are you located?', 'We are at 12 Harbour Way, Seaford, SF1 4QP. The site is a ten minute walk from Seaford railway station, and bus routes 12 and 44 stop directly outside.', 3),
('Visiting', 'Is there parking?', 'There is a public car park adjacent to the aquarium with 120 spaces, including eight accessible bays close to the entrance.', 4),

('Accessibility', 'Is the aquarium wheelchair accessible?', 'Yes. All four zones are step-free, with lifts serving the Rainforest Canopy Walk. Accessible toilets are located near the entrance and beside the Rockpools zone.', 5),
('Accessibility', 'Do you have quiet times for visitors who find crowds difficult?', 'Yes. Every Tuesday from 9am to 11am we run a sensory-friendly session with reduced lighting, no public announcements and lower background sound. A sensory map showing the quieter and louder areas of the aquarium is available at the entrance and on our Zones pages.', 6),
('Accessibility', 'Are assistance dogs welcome?', 'Assistance dogs are welcome throughout the aquarium. Water bowls are available at the entrance and beside the Rockpools zone.', 7),
('Accessibility', 'Do you offer anything for visitors with hearing loss?', 'Hearing loops are fitted in all talk areas. Written summaries of each daily talk are available at the entrance desk and on request from any member of staff.', 8),

('Animals', 'Where do your animals come from?', 'Most of our animals were bred in aquariums rather than collected from the wild. Where animals do come from the wild, they arrive through licensed suppliers or as rescues that cannot be returned to the sea.', 9),
('Animals', 'Can I touch the animals?', 'In the Touch Pool only, and always under the guidance of our team. We ask visitors to use two fingers, move slowly and follow the instructions given, so the animals are not stressed.', 10),
('Animals', 'What happens to animals that cannot be released?', 'We take in a small number of rescued animals each year that are unable to survive in the wild, usually because of injury. They live permanently in our care.', 11),

('Facilities', 'Is there somewhere to eat?', 'The Harbour Cafe on the ground floor serves hot food, sandwiches and drinks, with vegetarian, vegan and gluten free options. There is also a covered picnic area for visitors bringing their own food.', 12),
('Facilities', 'Are baby changing facilities available?', 'Baby changing tables are fitted in the accessible toilets near the entrance and beside the Rockpools zone. A quiet feeding room is available next to the Harbour Cafe.', 13),
('Facilities', 'Can I take photographs?', 'Yes, photography for personal use is welcome throughout the aquarium. We ask that you turn your flash off, as it startles the animals.', 14);