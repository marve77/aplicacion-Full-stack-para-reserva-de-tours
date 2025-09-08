export async function getReservations(token: string) {
  const res = await fetch('http://localhost:4000/reservations', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener reservaciones');
  return res.json();
}
