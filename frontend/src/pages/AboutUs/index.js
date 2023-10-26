import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function AboutUs() {
  const { setNav } = useContext(NavContext);

  useEffect(() => {
    setNav("about-us");
  }, [setNav]);

  return (
    <Layout>
      <h1 className="page-title">AboutUs</h1>
    </Layout>
  );
}
