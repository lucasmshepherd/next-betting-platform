// /src/app/page.tsx
// server component (no 'use client') if you don't need interactive stuff here
// just a landing page

export default function Home() {
  // no interactive code, so no use client
  return (
    <main>
      <h1>welcome to betsonpets</h1>
      <p>
        place bets on your favorite races or create new ones if youre admin
      </p>
    </main>
  );
}
