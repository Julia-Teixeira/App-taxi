import Map from "@/components/map";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config({ path: "../.env" });

export default await function Home() {
  const apiKey = process.env.GOOGLE_API_KEY!;

  return (
    <section className="content">
      <Map apiKey={apiKey} />
    </section>
  );
};
