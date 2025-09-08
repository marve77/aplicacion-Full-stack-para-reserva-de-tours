export async function getWeeklyEarnings(token: string) {
  const res = await fetch('http://localhost:4000/reservations/weekly-earnings', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener ganancias');
  return res.json();
}
