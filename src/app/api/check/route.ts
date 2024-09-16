export async function GET(req: Request) {
  const res = await fetch("http://auth_backend:8000/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": req.headers.get('Authorization') || ''
    },
  });

  const data = await res.json();
  return Response.json(data, {headers: res.headers, status: res.status, statusText: res.statusText});
}
