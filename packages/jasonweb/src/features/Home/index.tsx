function Header() {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24 py-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          Itamar (Jason) Zwi
        </h1>
        <h4 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
          Full Stack Developer
        </h4>
        <h6 className="mt-4 leading-normal max-w-md">
          I have a passion for puzzles and problem-solving, and I love sharing that passion with
          others
        </h6>
      </div>
    </header>
  );
}

function Home() {
  return (
    <div id="home" className="lg:flex lg:justify-between lg:gap-4 max-w-screen-xl mx-auto">
      <Header />

      <main className="basis-3">World</main>
    </div>
  );
}

export default Home;
