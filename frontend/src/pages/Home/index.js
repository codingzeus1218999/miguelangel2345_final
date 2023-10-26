import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function Home() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("home");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">Home</h1>
    </Layout>
  );
}
