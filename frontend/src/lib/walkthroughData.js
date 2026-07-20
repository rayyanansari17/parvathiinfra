// Data for the /the-view/walkthrough page.

export const WALKTHROUGH_FILM = '/assets/walkthrough/film.mp4';
export const WORDMARK_IMG = '/assets/walkthrough/the-view-wordmark.jpeg';
export const AERIAL_IMG = '/assets/walkthrough/aerial-master-plan.jpeg';
export const SCALE_MODEL_IMG = '/assets/walkthrough/scale-model-hero.jpeg';

// Real plot sizes (sq. yds) from the brochure legend. 45 plots total.
export const PLOT_SIZES = [
        371.21, 200, 233.33, 200, 200, 200, 200, 200, 200, 200, // 1-10
        200, 211.11, 200, 200, 200, 200, 200, 200, 200, 166.66, // 11-20
        166.66, 166.66, 166.66, 166.66, 166.66, 252.04, 200, 200, 200, 200, // 21-30
        264.14, 166.66, 166.66, 317.68, 320.54, 292.10, 311.83, 301.23, 269.24, 295.87, // 31-40
        295.04, 297.95, 306.02, 313.80, 388.44, // 41-45
];

// Rough layout coordinates for each plot in normalized (0-100) % over the aerial-master-plan.jpeg.
// Tuned to sit visually inside the plot rectangles rendered on the layout artwork.
// x/y = centre of the hotspot; w/h in % of the container.
export const PLOT_HOTSPOTS = [
        // Front block (right-of-arch area — plots 1-19 clustered by artwork)
        { n: 1,  x: 74.5, y: 45.5, w: 3.6, h: 5.0, facing: 'North' },
        { n: 2,  x: 69.0, y: 33.5, w: 3.2, h: 4.4, facing: 'North' },
        { n: 3,  x: 73.0, y: 33.5, w: 3.2, h: 4.4, facing: 'North' },
        { n: 4,  x: 77.0, y: 33.5, w: 3.2, h: 4.4, facing: 'North' },
        { n: 5,  x: 81.0, y: 33.5, w: 3.2, h: 4.4, facing: 'North' },
        { n: 6,  x: 85.0, y: 33.5, w: 3.2, h: 4.4, facing: 'North' },
        { n: 7,  x: 89.0, y: 33.5, w: 3.2, h: 4.4, facing: 'North' },
        { n: 8,  x: 92.6, y: 33.5, w: 3.2, h: 4.4, facing: 'North' },
        { n: 9,  x: 92.6, y: 27.6, w: 3.2, h: 4.2, facing: 'East' },
        { n: 10, x: 89.0, y: 27.6, w: 3.2, h: 4.2, facing: 'North' },
        { n: 11, x: 85.0, y: 27.6, w: 3.2, h: 4.2, facing: 'North' },
        { n: 12, x: 81.0, y: 27.6, w: 3.2, h: 4.2, facing: 'North' },
        { n: 13, x: 77.0, y: 27.6, w: 3.2, h: 4.2, facing: 'North' },
        { n: 14, x: 73.0, y: 27.6, w: 3.2, h: 4.2, facing: 'North' },
        { n: 15, x: 69.0, y: 27.6, w: 3.2, h: 4.2, facing: 'North' },
        { n: 16, x: 65.4, y: 27.6, w: 3.2, h: 4.2, facing: 'North' },
        { n: 17, x: 65.4, y: 32.4, w: 3.2, h: 3.5, facing: 'South' },
        { n: 18, x: 65.4, y: 37.0, w: 3.2, h: 3.7, facing: 'South' },
        { n: 19, x: 65.4, y: 45.5, w: 3.2, h: 4.0, facing: 'South' },
        // Central spine, 20-33
        { n: 20, x: 61.2, y: 37.0, w: 3.0, h: 3.5, facing: 'North' },
        { n: 21, x: 57.4, y: 37.0, w: 3.0, h: 3.5, facing: 'North' },
        { n: 22, x: 53.6, y: 37.0, w: 3.0, h: 3.5, facing: 'North' },
        { n: 23, x: 49.8, y: 37.0, w: 3.0, h: 3.5, facing: 'North' },
        { n: 24, x: 46.0, y: 37.0, w: 3.0, h: 3.5, facing: 'North' },
        { n: 25, x: 42.4, y: 37.0, w: 3.0, h: 3.5, facing: 'North' },
        { n: 26, x: 38.6, y: 37.0, w: 3.4, h: 3.9, facing: 'North' },
        { n: 27, x: 38.6, y: 42.5, w: 3.4, h: 3.9, facing: 'South' },
        { n: 28, x: 42.4, y: 42.5, w: 3.0, h: 3.5, facing: 'South' },
        { n: 29, x: 46.0, y: 42.5, w: 3.0, h: 3.5, facing: 'South' },
        { n: 30, x: 49.8, y: 42.5, w: 3.0, h: 3.5, facing: 'South' },
        { n: 31, x: 53.6, y: 42.5, w: 3.4, h: 3.9, facing: 'South' },
        { n: 32, x: 57.4, y: 42.5, w: 3.0, h: 3.5, facing: 'South' },
        { n: 33, x: 61.2, y: 42.5, w: 3.0, h: 3.5, facing: 'South' },
        // Bottom row, 34-45
        { n: 34, x: 38.6, y: 51.5, w: 3.5, h: 4.5, facing: 'South' },
        { n: 35, x: 42.6, y: 51.5, w: 3.5, h: 4.5, facing: 'South' },
        { n: 36, x: 46.6, y: 51.5, w: 3.3, h: 4.3, facing: 'South' },
        { n: 37, x: 50.4, y: 51.5, w: 3.5, h: 4.5, facing: 'South' },
        { n: 38, x: 54.2, y: 51.5, w: 3.4, h: 4.4, facing: 'South' },
        { n: 39, x: 58.0, y: 51.5, w: 3.2, h: 4.2, facing: 'South' },
        { n: 40, x: 61.6, y: 51.5, w: 3.4, h: 4.4, facing: 'South' },
        { n: 41, x: 65.4, y: 51.5, w: 3.4, h: 4.4, facing: 'South' },
        { n: 42, x: 69.2, y: 51.5, w: 3.4, h: 4.4, facing: 'South' },
        { n: 43, x: 73.0, y: 51.5, w: 3.5, h: 4.4, facing: 'South' },
        { n: 44, x: 77.0, y: 51.5, w: 3.5, h: 4.5, facing: 'South' },
        { n: 45, x: 81.2, y: 51.5, w: 3.9, h: 4.7, facing: 'South' },
];

// Amenity legend from the master plan.
export const AMENITY_HOTSPOTS = [
        { code: 'A', name: 'Grand Entrance',        x: 55.5, y: 62.0, blurb: 'Signature gold-lit stone entrance arch flanked by Parvathi Infra flags.' },
        { code: 'B', name: '30 ft. Wide Road',      x: 60.0, y: 47.0, blurb: 'Tree-lined central boulevard laid in CC concrete, ~30 ft wide.' },
        { code: 'C', name: "Children's Play Area",  x: 76.0, y: 41.0, blurb: 'Softscape play zone with elegant equipment and shaded seating.' },
        { code: 'D', name: 'Clubhouse',             x: 45.0, y: 60.0, blurb: '2,220 sq.ft. clubhouse — lounge, gym, indoor games, café.' },
        { code: 'E', name: 'Pool & Amphitheatre',   x: 48.5, y: 65.5, blurb: 'Infinity-edge swimming pool, kids’ pool and amphitheatre entry.' },
        { code: 'F', name: 'Sitting Area',          x: 70.0, y: 55.0, blurb: 'Granite bench seating tucked into landscaped pockets.' },
        { code: 'G', name: 'Gazebo',                x: 32.0, y: 55.0, blurb: 'Wrought-iron gazebos for quiet evenings and small gatherings.' },
        { code: 'H', name: 'Amphitheatre',          x: 40.0, y: 66.0, blurb: 'Open-air stone amphitheatre for cultural evenings and cinema nights.' },
        { code: 'I', name: 'View Point',            x: 30.0, y: 43.0, blurb: 'Panoramic terrace on the highest ridge — the "view" the brand is named for.' },
];

// Cinematic caption waypoints keyed to video.currentTime (seconds).
// Tune these to your final film's cuts.
export const CAPTIONS = [
        { time: 0.0,  title: 'THE VIEW',                    copy: 'On a scenic hill, where the future is moving.' },
        { time: 5.0,  title: 'The Grand Arch',              copy: 'Where first impressions become lasting statements.' },
        { time: 9.0,  title: 'A Grand Arrival',             copy: 'Welcomed by Parvathi Infra. A statement of belonging.' },
        { time: 14.0, title: '45 Exclusive Plots',          copy: '30-ft tree-lined avenues. 100% Vastu.' },
        { time: 20.0, title: 'Elegant Clubhouse',           copy: '2,220 sq.ft clubhouse & infinity-edge pool.' },
        { time: 26.0, title: 'Open-Air Amphitheatre',       copy: 'Cultural & social gatherings under the sky.' },
        { time: 31.0, title: 'The View Point',              copy: 'A Scenic Address for a Selective Few.' },
        { time: 37.0, title: 'Own Before the City Arrives', copy: 'Book your private site visit.' },
];

// Chapter rail dots — same order as CAPTIONS. Nine chapters per spec (last one is Outro alt view of #8).
export const CHAPTERS = [
        { n: 1, label: 'Sky Approach' },
        { n: 2, label: 'The Arch Reveal' },
        { n: 3, label: 'Entering the Gate' },
        { n: 4, label: 'The Avenue' },
        { n: 5, label: 'Clubhouse & Pool' },
        { n: 6, label: 'Amphitheatre' },
        { n: 7, label: 'View Point' },
        { n: 8, label: 'Parks & Lawns' },
        { n: 9, label: 'Outro' },
];

// Nearest amenities per plot (very simple heuristic by row).
export function nearestAmenities(plotNo) {
        if (plotNo >= 34 && plotNo <= 45) return ['H · Amphitheatre', 'D · Clubhouse', 'E · Pool'];
        if (plotNo >= 20 && plotNo <= 33) return ['B · 30 ft. Road', 'F · Sitting Area', 'G · Gazebo'];
        if (plotNo >= 1 && plotNo <= 19)  return ['C · Kids Play', 'A · Grand Entrance', 'I · View Point'];
        return [];
}
