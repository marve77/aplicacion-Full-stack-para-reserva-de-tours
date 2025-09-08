
export const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:4000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Credenciales inválidas');
  }
  return response.json();
};

export const logout = async () => {
  // Simulación de cierre de sesión
  return true;
};
