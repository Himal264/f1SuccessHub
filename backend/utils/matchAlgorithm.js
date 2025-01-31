export function calculateUniversityMatch(studentProfile, university) {
  // Your existing matching algorithm implementation
  // Make sure to handle all schema fields appropriately
}

export function rankUniversities(studentProfile, universities) {
  return universities
    .map(university => ({
      ...calculateUniversityMatch(studentProfile, university),
      university // Attach full university data
    }))
    .sort((a, b) => b.totalScore - a.totalScore);
}