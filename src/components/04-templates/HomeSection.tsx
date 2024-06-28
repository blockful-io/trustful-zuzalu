import { Header, Footer } from "@/components/01-atoms";
import { MainPane } from "@/components/03-organisms";

export const HomeSection = () => {
  return (
    <>
      <Header />

      <div className="w-full h-full justify-center flex p-4">
        <MainPane />
      </div>
      <Footer />
    </>
  );
};
