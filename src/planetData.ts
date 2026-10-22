export interface PlanetData {
  name: string;
  color: string;
  radius: number; // visual radius in pixels
  orbitRadius: number; // visual orbit radius in pixels
  diameter: number; // real diameter in km
  distanceFromSun: number; // in million km
  orbitalPeriod: number; // in Earth days
  orbitalSpeed: number; // relative speed factor
  description: string;
  emoji: string;
}

export const planets: PlanetData[] = [
  {
    name: "Mercury",
    color: "#b5b5b5",
    radius: 4,
    orbitRadius: 60,
    diameter: 4879,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    orbitalSpeed: 4.15,
    description: "The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.",
    emoji: "☿",
  },
  {
    name: "Venus",
    color: "#e8cda0",
    radius: 7,
    orbitRadius: 90,
    diameter: 12104,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    orbitalSpeed: 1.62,
    description: "The hottest planet with a thick toxic atmosphere. It rotates in the opposite direction to most planets.",
    emoji: "♀",
  },
  {
    name: "Earth",
    color: "#4da6ff",
    radius: 7,
    orbitRadius: 125,
    diameter: 12756,
    distanceFromSun: 149.6,
    orbitalPeriod: 365,
    orbitalSpeed: 1.0,
    description: "Our home planet. The only known planet with liquid water on its surface and life.",
    emoji: "🌍",
  },
  {
    name: "Mars",
    color: "#e07050",
    radius: 5,
    orbitRadius: 165,
    diameter: 6792,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    orbitalSpeed: 0.53,
    description: "The Red Planet. It has the largest volcano (Olympus Mons) and canyon in the solar system.",
    emoji: "♂",
  },
  {
    name: "Jupiter",
    color: "#d4a574",
    radius: 16,
    orbitRadius: 220,
    diameter: 142984,
    distanceFromSun: 778.6,
    orbitalPeriod: 4333,
    orbitalSpeed: 0.084,
    description: "The largest planet. Its Great Red Spot is a storm larger than Earth that has raged for centuries.",
    emoji: "♃",
  },
  {
    name: "Saturn",
    color: "#f0d890",
    radius: 14,
    orbitRadius: 280,
    diameter: 120536,
    distanceFromSun: 1433.5,
    orbitalPeriod: 10759,
    orbitalSpeed: 0.034,
    description: "Known for its stunning ring system made of ice and rock. It could float in water due to its low density.",
    emoji: "♄",
  },
  {
    name: "Uranus",
    color: "#7ec8e3",
    radius: 10,
    orbitRadius: 330,
    diameter: 51118,
    distanceFromSun: 2872.5,
    orbitalPeriod: 30687,
    orbitalSpeed: 0.012,
    description: "An ice giant that rotates on its side. It has a blue-green color due to methane in its atmosphere.",
    emoji: "♅",
  },
  {
    name: "Neptune",
    color: "#4470e0",
    radius: 9,
    orbitRadius: 370,
    diameter: 49528,
    distanceFromSun: 4495.1,
    orbitalPeriod: 60190,
    orbitalSpeed: 0.006,
    description: "The windiest planet with speeds up to 2,100 km/h. It's the farthest planet from the Sun.",
    emoji: "♆",
  },
];
