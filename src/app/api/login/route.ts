export async function POST(req: Request) {
  const json = await req.json();
  console.log(json);
  const res = await fetch("http://auth_backend:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  const data = await res.json();
  return Response.json(data, {headers: res.headers, status: res.status, statusText: res.statusText});
}
