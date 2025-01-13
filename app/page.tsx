export default function Home() {
  return (
    <section className='py-24'>
      <div className='container'>
        <h1 className='text-3xl font-bold'>Next TS Starter</h1>
        <p className="mt-4 text-lg">Welcome to ServeWell! Navigate through the pages below:</p>
        <nav className="mt-8">
          <ul className="space-y-4">
            <li>
              <a href="/finances" className="text-blue-500 hover:underline">Go to Finances</a>
            </li>
            <li>
              <a href="/member-tracking" className="text-blue-500 hover:underline">Go to Member Tracking</a>
            </li>
            <li>
              <a href="/church-creation" className="text-blue-500 hover:underline">Go to Church Registration</a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}