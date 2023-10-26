import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function News() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("news");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">News</h1>
    </Layout>
  );
}
