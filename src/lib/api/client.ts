export async function apiRequest(endpoint: string) {
  const baseUrl = window.location.origin;
  
  const response = await fetch(`${baseUrl}${endpoint}`);
  return response.json();
}
