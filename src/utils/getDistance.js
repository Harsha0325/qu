export async function getRoadDistanceByApiRoad(lat1, lon1, lat2, lon2) {
  const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === "Ok") {
      return (data.routes[0].distance / 1000).toFixed(2); // Convert meters to km
    } else {
      console.error("No Route Found");
      return null;
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

// Fast Haversine formula with a road multiplier for realistic results
export function estimatedRoadDistanceByHaversineStraightLine(
  lat1,
  lon1,
  lat2,
  lon2
) {
  // Multiplier to estimate real road distance from Haversine (adjustable)
  const ROAD_MULTIPLIER = 1.3;
  const R = 6371; // Earth's radius in km
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c; // Haversine distance
  const realisticDistance = straightDistance * ROAD_MULTIPLIER; // Apply multiplier

  return {
    straightDistance: straightDistance.toFixed(2),
    realisticDistance: realisticDistance.toFixed(2),
  };
}

// const lat1 = 13.0591,
//   lon1 = 77.578919;
// const lat2 = 13.0321976,
//   lon2 = 78.145988;
// // Compare both distances
// async function compareDistances() {
//   estimatedRoadDistance(lat1, lon1, lat2, lon2); // Fast estimation
//   console.log(
//     "📌 Comparing Distances... ----------------------------------------"
//   );
//   await getRoadDistance(lat1, lon1, lat2, lon2); // API call (optional)
// }

// compareDistances();
